<?php

namespace NikRolls\SsFreedom;

use InvalidArgumentException;
use SilverStripe\CMS\Controllers\ModelAsController;
use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Core\Config\Config as SS_Config;
use SilverStripe\ErrorPage\ErrorPage;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\HasManyList;
use SilverStripe\ORM\ManyManyList;
use SilverStripe\ORM\RelationList;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\Security;
use SilverStripe\Versioned\Versioned;

class ApiController extends Controller implements PermissionProvider
{
    private static $allowed_actions = [
        'getObjectInfo' => 'NIKROLLS_SSFREEDOM_EDIT',
        'getOptionsForm' => 'NIKROLLS_SSFREEDOM_EDIT',
        'deleteObject' => 'NIKROLLS_SSFREEDOM_EDIT',
        'updateObject' => 'NIKROLLS_SSFREEDOM_EDIT',
        'publishObject' => 'NIKROLLS_SSFREEDOM_EDIT',
        'addItemToList' => 'NIKROLLS_SSFREEDOM_EDIT',
        'removeItemFromList' => 'NIKROLLS_SSFREEDOM_EDIT',
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

    public function deleteObject(HTTPRequest $request)
    {
        $this->ensureStagedMode();
        $this->ensureHttpMethod('DELETE');

        $body = json_decode($request->getBody());

        $this->ensureClassProperty($body);
        $this->ensureIdProperty($body);

        $this->ensureClassIsDataObject($body);
        $object = $this->getObjectById($body->class, $body->id);
        $this->ensureObjectIsDeletable($object);
        if ($object->hasMethod('canUnpublish')) {
            $this->ensureObjectCanBeUnPublished($object);
        }

        if ($object->hasMethod('doUnpublish')) {
            $object->doUnpublish();
        }
        $object->delete();

        if (isset($body->currentPage)) {
            return $this->renderObject($this->getObjectById($body->currentPage->class, $body->currentPage->id));
        } else {
            return $this->http_response_code(200);
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

    public function addItemToList(HTTPRequest $request)
    {
        $this->ensureStagedMode();
        $this->ensureHttpMethod('POST');

        $body = json_decode($request->getBody());

        $this->ensureClassProperty($body);
        $this->ensureIdProperty($body);
        $this->ensureRelationProperty($body);
        $this->validateBetweenIdsProperty($body);

        $this->ensureClassIsDataObject($body);
        $object = $this->getObjectById($body->class, $body->id);
        $this->ensureObjectHasRelation($object, $body->relation);

        /** @var RelationList $relation */
        $relation = $object->{$body->relation}();
        $newObjectClass = $relation->dataClass();
        /** @var DataObject $newObject */
        $newObject = $newObjectClass::create();
        $this->ensureObjectIsCreatable(
            $newObject //,
            // [$newObject->getReverseAssociation($object->ClassName) => $object]
        );

        $newObject->write();
        if ($relation instanceof HasManyList) {
            $this->sortHasManyListIfPossible($relation, $newObject, $body->betweenIds);
            $relation->add($newObject);
        } else if ($relation instanceof ManyManyList) {
            $this->sortManyManyListIfPossible($relation, $newObject, $body->betweenIds);
        }

        if (isset($body->currentPage)) {
            return $this->renderObject(
                $this->getObjectById($body->currentPage->class, $body->currentPage->id),
                201
            );
        } else {
            return $this->renderObject(
                $this->getObjectById($object->ClassName, $object->ID),
                201
            );
        }
    }

    public function removeItemFromList(HTTPRequest $request)
    {
        $this->ensureStagedMode();
        $this->ensureHttpMethod('DELETE');

        $body = json_decode($request->getBody());

        $this->ensureClassProperty($body);
        $this->ensureIdProperty($body);
        $this->ensureRelationProperty($body);
        $this->ensureItemIdProperty($body);

        $this->ensureClassIsDataObject($body);
        $object = $this->getObjectById($body->class, $body->id);
        $this->ensureObjectHasRelation($object, $body->relation);

        /** @var RelationList $relation */
        $relation = $object->{$body->relation}();
        $relation->removeByID($body->itemId);

        if (isset($body->currentPage)) {
            return $this->renderObject(
                $this->getObjectById($body->currentPage->class, $body->currentPage->id),
                200
            );
        } else {
            return $this->http_response_code(200);
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

    private function ensureRelationProperty(object $body)
    {
        if (!isset($body->relation)) {
            $this->httpError(422, 'no "relation" property');
        }
    }

    private function ensureItemIdProperty(object $body)
    {
        if (!isset($body->itemId)) {
            $this->httpError(422, 'no "itemId" property');
        }
    }

    private function validateBetweenIdsProperty(object $body)
    {
        if (isset($body->betweenIds) && !is_array($body->betweenIds)) {
            $this->httpError(422, '"betweenIds" must be an array');
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

    private function ensureObjectHasRelation(DataObject $object, $relation)
    {
        if (!$object->$relation() instanceof RelationList) {
            $this->httpError(422, "$object->ClassName does not have a relation: $relation");
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

    private function ensureObjectIsCreatable(DataObject $object, $context = null)
    {
        if (!$object->canCreate(null, $context)) {
            $this->httpError(403, "You don't have permission to create $object->ClassName objects.");
        }
    }

    private function ensureObjectIsWritable(DataObject $object)
    {
        if (!$object->canEdit()) {
            $this->httpError(403, 'You don\'t have permission to edit this object.');
        }
    }

    private function ensureObjectIsDeletable(DataObject $object)
    {
        if (!$object->canDelete()) {
            $this->httpError(403, 'You don\'t have permission to delete this object.');
        }
    }

    private function ensureObjectCanBePublished(DataObject $object)
    {
        if (!($object->hasMethod('canPublish') && $object->canPublish())) {
            $this->httpError(403, 'You don\'t have permission to publish this object.');
        }
    }

    private function ensureObjectCanBeUnPublished(DataObject $object)
    {
        if (!($object->hasMethod('canUnpublish') && $object->canUnpublish())) {
            $this->httpError(403, 'You don\'t have permission to unpublish this object.');
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

    private function sortHasManyListIfPossible(HasManyList $list, DataObject $object, array $betweenIds)
    {
        $this->sortListIfPossible(
            $list,
            $object,
            $betweenIds,
            SS_Config::inst()->get($object->ClassName, 'default_sort'),
            function ($item, $field) {
                return $item->getField($field);
            },
            function ($item, $field, $value) {
                $item->setField($field, $value);
                $item->write();
            }
        );
    }

    private function sortManyManyListIfPossible(ManyManyList $list, DataObject $object, array $betweenIds)
    {
        $this->sortListIfPossible(
            $list,
            $object,
            $betweenIds,
            SS_Config::inst()->get($list->getJoinTable(), 'default_sort'),
            function ($item, $field) use ($list) {
                return $list->getExtraData(null, $item->ID)[$field];
            },
            function ($item, $field, $value) use ($list) {
                $list->add($item, [$field => $value]);
            }
        );
    }

    private function sortListIfPossible(
        RelationList $list,
        DataObject $object,
        array $betweenIds,
        string $defaultSort,
        callable $getSortValue,
        callable $setSortValue
    ) {
        if ($defaultSort) {
            $defaultSort = $this->extractSortDefinition($defaultSort);
            $resorting = false;
            $index = null;
            $step = $defaultSort['direction'] === 'ASC' ? 1 : -1;
            $betweenIds = array_filter($betweenIds);
            if (count($betweenIds) === 1) {
                if ($list->first()->ID == $betweenIds[0]) {
                    $index = $getSortValue($list->first(), $defaultSort['field']);
                    $setSortValue($object, $defaultSort['field'], $index - $step);
                } else if ($list->last()->ID == $betweenIds[0]) {
                    $index = $getSortValue($list->last(), $defaultSort['field']);
                    $setSortValue($object, $defaultSort['field'], $index + $step);
                }
            } else {
                foreach ($list as $item) {
                    if (!$resorting && array_search($item->ID, $betweenIds) !== false) {
                        $index = $getSortValue($item, $defaultSort['field']);
                        $item = $object;
                        $resorting = true;
                    }
                    if ($resorting) {
                        $setSortValue($item, $defaultSort['field'], $index += $step);
                    }
                }
            }
        }
    }

    private function extractSortDefinition(string $sortDefinition)
    {
        preg_match(
            '`(?:^|\.)"?(?<field>[^"\s]+)"?(?:\s+(?<direction>ASC|DESC))?\s*$`i',
            $sortDefinition,
            $sortParts
        );
        $sortParts['direction'] = isset($sortParts['direction']) ? strtoupper($sortParts['direction']) : 'ASC';
        return $sortParts;
    }

    private function renderObject(DataObject $object, int $statusCode = 200)
    {
        if ($object->hasMethod('forTemplate')) {
            $response = HTTPResponse::create();
            $response->addHeader('Content-Type', 'text/html');
            $response->setBody($object->forTemplate());
        } elseif ($object instanceof SiteTree) {
            $controller = ModelAsController::controller_for($object);
            $response = $controller->handleRequest($this->getRequest());
        } else {
            $response = $this->getResponse();
            $response->addHeader('Content-Type', 'application/json');
            $response->setBody(json_encode($object->toMap()));
        }
        $response->setStatusCode($statusCode);
        return $response;
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
