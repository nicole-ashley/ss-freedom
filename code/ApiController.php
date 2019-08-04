<?php

namespace NikRolls\SsFreedom;

use SilverStripe\CMS\Controllers\ModelAsController;
use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Core\Convert;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\ORM\DataObject;
use SilverStripe\Security\PermissionProvider;

class ApiController extends Controller implements PermissionProvider
{
    private static $allowed_actions = [
        'get_options_form',
        'update_object'
    ];

    public function get_options_form(HTTPRequest $request)
    {
        $this->ensureStagedMode();
        $this->ensureHttpMethod('GET');

        $vars = (object)$request->getVars();

        $this->ensureClassProperty($vars);
        $this->ensureIdProperty($vars);

        $this->ensureClassIsDataObject($vars);
        $this->ensureClassHasOptionsFields($vars);

        $object = $this->getObjectById($vars->class, $vars->id);

        /** @var FieldList $fields */
        $fields = $object->getObjectOptionsFields();

        $form = Form::create(null, null, $fields);
        $form->loadDataFrom($object);
        $form->setFormMethod('POST');
        return $form->forAjaxTemplate();
    }

    public function update_object(HTTPRequest $request)
    {
        $this->ensureStagedMode();
        $this->ensureHttpMethod('PATCH');

        $body = json_decode($request->getBody());

        $this->ensureClassProperty($body);
        $this->ensureIdProperty($body);
        $this->ensureDataProperty($body);

        $this->ensureClassIsDataObject($body);
        $object = $this->getObjectById($body->class, $body->id);
        $this->ensureObjectIsWritable($object);

        $this->updateObjectWithData($object, $body->data);

        return $this->renderObject($this->getObjectById($object->ClassName, $object->ID));
    }

    private function ensureStagedMode()
    {
        if (class_exists('SilverStripe\Versioned\Versioned')) {
            \SilverStripe\Versioned\Versioned::set_reading_mode('Stage.Stage');
        }
    }

    private function ensureHttpMethod(string $method)
    {
        if ($this->getRequest()->httpMethod() !== strtoupper($method)) {
            $this->httpError(405);
        }
    }

    private function ensureClassProperty(object $body)
    {
        if (!isset($body->class)) {
            $this->httpError(422, 'Missing "class" property.');
        }
    }

    private function ensureIdProperty(object $body)
    {
        if (!isset($body->id)) {
            $this->httpError(422, 'No "id" property.');
        }
    }

    private function ensureDataProperty(object $body)
    {
        if (!isset($body->data) || !is_object($body->data)) {
            $this->httpError(422, '"data" must be a key/value pair object.');
        }
    }

    private function ensureClassIsDataObject(object $body)
    {
        if (!array_search($body->class, ClassInfo::getValidSubClasses('SilverStripe\ORM\DataObject'))) {
            $this->httpError(422, "No such data object: $body->class");
        }
    }

    private function ensureClassHasOptionsFields(object $body)
    {
        if (!(singleton($body->class) instanceof ObjectOptionsFields)) {
            $this->httpError(422, "Data object does not have options fields: $body->class");
        }
    }

    private function getObjectById(string $class, int $id)
    {
        $object = DataObject::get_by_id($class, $id);

        if (!($object && $object->exists())) {
            $this->httpError(404, "No such object with that ID: $class#$id");
        }

        return $object;
    }

    private function ensureObjectIsWritable(DataObject $object)
    {
        if (!$object->canEdit()) {
            $this->httpError(403, 'You don\'t have permission to edit this object.');
        }
    }

    private function updateObjectWithData(DataObject $object, object $data)
    {
        foreach (get_object_vars($data) as $key => $value) {
            $object->setField($key, $value);
        }
        $object->write();
    }

    private function renderObject(DataObject $object)
    {
        if ($object->hasMethod('forTemplate')) {
            return $object->forTemplate();
        } else if ($object instanceof SiteTree) {
            return ModelAsController::controller_for($object);
        } else {
            $response = $this->getResponse();
            $response->addHeader('Content-Type', 'application/json');
            $response->setBody(Convert::array2json($object->toMap()));
            return $response;
        }
    }

    public function providePermissions()
    {
        return [
            'NIKROLLS_SSFREEDOM_EDIT' => [
                'category' => 'SS Freedom',
                'name' => 'View the SS Freedom interface in the frontend
                           (must also have Edit access for required objects)'
            ]
        ];
    }
}
