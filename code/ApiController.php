<?php

namespace NikRolls\SsFreedom;

use Exception;
use InvalidArgumentException;
use SilverStripe\CMS\Controllers\ModelAsController;
use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Core\Convert;
use SilverStripe\ErrorPage\ErrorPage;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\ORM\DataObject;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\Security;
use SilverStripe\Versioned\Versioned;

class ApiController extends Controller implements PermissionProvider
{
    private static $allowed_actions = [
        'getObjectInfo' => 'NIKROLLS_SSFREEDOM_EDIT',
        'getOptionsForm' => 'NIKROLLS_SSFREEDOM_EDIT',
        'updateObject' => 'NIKROLLS_SSFREEDOM_EDIT',
        'publishObject' => 'NIKROLLS_SSFREEDOM_EDIT',
        'getLinkList' => 'NIKROLLS_SSFREEDOM_EDIT'
    ];

    public function getObjectInfo(HTTPRequest $request)
    {
        $this->ensureStagedMode();
        $this->ensureHttpMethod('GET');

        $vars = (object) $request->getVars();

        $this->ensureIdProperty($vars);
        $this->ensureClassIsDataObject($vars);

        $object = $this->getObjectById($vars->class, $vars->id);

        $response = HTTPResponse::create();
        $response->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode($object->getFreedomAttributes()['data']));
        return $response;
    }

    public function getOptionsForm(HTTPRequest $request)
    {
        $this->ensureStagedMode();
        $this->ensureHttpMethod('GET');

        $vars = (object) $request->getVars();

        $this->ensureClassProperty($vars);
        $this->ensureIdProperty($vars);

        $this->ensureClassIsDataObject($vars);
        $this->ensureClassHasOptionsFields($vars);

        $object = $this->getObjectById($vars->class, $vars->id);

        /** @var FieldList $fields */
        $fields = $object->getFreedomOptionsFields();

        $form = Form::create(null, null, $fields);
        $form->loadDataFrom($object);
        $form->setFormMethod('POST');
        return $form->forAjaxTemplate();
    }

    public function updateObject(HTTPRequest $request)
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

        if (isset($body->currentPage)) {
            return $this->renderObject($this->getObjectById($body->currentPage->class, $body->currentPage->id));
        } else {
            return $this->renderObject($this->getObjectById($object->ClassName, $object->ID));
        }
    }

    public function publishObject(HTTPRequest $request)
    {
        $this->ensureStagedMode();
        $this->ensureHttpMethod('POST');

        $body = json_decode($request->getBody());
        $this->ensureIdProperty($body);

        $this->ensureClassIsDataObject($body);
        /** @var DataObject | Versioned $object */
        $object = $this->getObjectById($body->class, $body->id);
        $this->ensureObjectCanBePublished($object);

        $object->publishRecursive();

        if (isset($body->currentPage)) {
            return $this->renderObject($this->getObjectById($body->currentPage->class, $body->currentPage->id));
        } else {
            return $this->renderObject($this->getObjectById($object->ClassName, $object->ID));
        }
    }

    public function getLinkList(HTTPRequest $request)
    {
        $this->ensureStagedMode();
        $this->ensureHttpMethod('GET');

        $linkList = static::generateLinkList();

        $response = HTTPResponse::create();
        $response->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode($linkList));
        return $response;
    }

    private function ensureStagedMode()
    {
        Versioned::set_reading_mode('Stage.Stage');
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
        if (!array_search($body->class, ClassInfo::getValidSubClasses(DataObject::class))) {
            $this->httpError(422, "No such data object: $body->class");
        }
    }

    private function ensureClassHasOptionsFields(object $body)
    {
        if (!(singleton($body->class) instanceof OptionsFields)) {
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

    private function ensureObjectCanBePublished(DataObject $object)
    {
        if (!($object->hasMethod('canPublish') && $object->canPublish())) {
            $this->httpError(403, 'You don\'t have permission to publish this object.');
        }
    }

    private function updateObjectWithData(DataObject $object, object $data)
    {
        foreach (get_object_vars($data) as $key => $value) {
            $object->setField($key, $value);
        }

        if ($object->hasExtension(Versioned::class)) {
            $this->writeOrUpdateCurrentVersionIfSameAuthor($object);
        } else {
            $object->write();
        }
    }

    private function writeOrUpdateCurrentVersionIfSameAuthor(DataObject $object)
    {
        try {
            $version = Versioned::get_version($object->ClassName, $object->ID, $object->Version);
        } catch (InvalidArgumentException $_) {
            $version = null;
        }

        if (
            $version &&
            !$version->WasPublished &&
            $version->Author()->ID == Security::getCurrentUser()->ID
        ) {
            $object->writeWithoutVersion();
        } else {
            $object->write();
        }
    }

    private function renderObject(DataObject $object)
    {
        if ($object->hasMethod('forTemplate')) {
            return $object->forTemplate();
        } elseif ($object instanceof SiteTree) {
            $controller = ModelAsController::controller_for($object);
            $response = $controller->handleRequest($this->getRequest());
            $response->setStatusCode(200);
            return $response;
        } else {
            $response = $this->getResponse();
            $response->addHeader('Content-Type', 'application/json');
            $response->setBody(Convert::array2json($object->toMap()));
            return $response;
        }
    }

    private static function generateLinkList(SiteTree $parent = null)
    {
        $output = [];
        $tree = static::generatePageTree($parent);

        foreach ($tree as $id => $title) {
            $output[] = ['title' => $title, 'value' => "[sitetree_link id={$id}]"];
        }

        return $output;
    }

    public static function generatePageTree(SiteTree $parent = null, $parentIsLast = false)
    {
        $output = [];
        $depth = $parent ? static::getPageDepth($parent) + 1 : 0;
        $pages = SiteTree::get()
            ->filter(['ParentID' => $parent ? $parent->ID : 0])
            ->exclude(['ClassName' => ErrorPage::class]);
        $pageCount = $pages->count();

        foreach ($pages as $i => $page) {
            /** @var SiteTree $page */
            $isLast = $i + 1 >= $pageCount;

            if ($depth > 0 && !$parentIsLast) {
                $treePrefix = str_repeat('┃　', $depth - 1);
            } elseif ($depth > 0 && $parentIsLast) {
                $treePrefix = str_repeat('　　', $depth - 1);
            } else {
                $treePrefix = '';
            }
            if ($depth > 0) {
                $treePrefix .= $isLast ? '┗　' : '┣　';
            }
            $output[$page->ID] = $treePrefix . $page->MenuTitle;

            if ($page->Children()->count()) {
                $output = array_merge($output, static::generatePageTree($page, $isLast));
            }
        }

        return $output;
    }

    private static function getPageDepth(SiteTree $page)
    {
        $parent = $page->Parent();
        if ($parent && $parent->exists()) {
            return static::getPageDepth($parent) + 1;
        } else {
            return 0;
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
