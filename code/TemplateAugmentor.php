<?php

namespace NikRolls\SsFreedom;

use SilverStripe\Core\Config\Config as SS_Config;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\ORM\DataExtension;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\ORM\HasManyList;
use SilverStripe\ORM\ManyManyList;
use SilverStripe\ORM\RelationList;
use SilverStripe\Versioned\RecursivePublishable;
use SilverStripe\Versioned\Versioned;

/**
 * @property DataObject owner
 */
class TemplateAugmentor extends DataExtension
{
    /**
     * Override the default field type detection for $db fields.
     * You can use this to specify custom TinyMCE configurations per field.
     *
     * Syntax:
     *   'FieldName' => 'field_type'
     *
     * Field types can be int, float, date, datetime, time, text, html, or
     * the key of any TinyMCE configuration you've added to
     * NikRolls\SsFreedom\Config->tinymce.
     */
    private static $freedom_field_types = [];

    public function FreedomIsActive()
    {
        return Config::isAugmentationActive($this->owner);
    }

    public function FreedomAttributes($for = '$Me', $hiddenWhenEmpty = false)
    {
        if (!$this->FreedomIsActive()) {
            return '';
        }

        $data = $this->getFreedomAttributes($for);

        if (!$data) {
            return '';
        }

        $output = $this->prepareAttributes($data);

        if ($hiddenWhenEmpty) {
            $output[] = 'ss-freedom-hidden-when-empty';
        }

        return $this->asHTML(implode(' ', $output));
    }

    public function getFreedomAttributes($for = '$Me')
    {
        if ($for === '$Me') {
            return $this->attributesForObject($this->owner);
        } elseif ($this->hasDbField($for)) {
            return $this->attributesForDbField($for);
        } elseif ($this->hasRelation($for)) {
            return $this->attributesForRelation($for);
        }
    }

    public function isLiveVersionRecursive()
    {
        if ($this->owner->hasExtension(Versioned::class)) {
            $pageIsLive = $this->owner->isLiveVersion();

            $ownedNotLive = null;
            if ($this->owner->hasExtension(RecursivePublishable::class)) {
                $owned = $this->owner->findOwned();

                foreach ($owned as $item) {
                    if ($item->hasMethod('isLiveVersion') && !$item->isLiveVersion()) {
                        $ownedNotLive = $item;
                        break;
                    }
                }
            }

            return $pageIsLive && empty($ownedNotLive);
        } else {
            return null;
        }
    }

    private function prepareAttributes($data)
    {
        $output = [];

        foreach ($data as $key => $value) {
            $value = is_string($value) || is_numeric($value) ? $value : json_encode($value);
            $value = Convert::raw2att(trim($value));
            $output[] = "ss-freedom-$key=\"$value\"";
        }

        return $output;
    }

    private static function attributesForObject(DataObject $object)
    {
        $attributes = [
            'object' => static::generateUID($object),
            'class' => get_class($object),
            'id' => $object->ID,
            'data' => [
                'hasOptions' => $object instanceof OptionsFields
            ]
        ];

        $attributes['data'] = static::addPublishedDataForObjectIfAvailable($attributes['data'], $object);
        $attributes['data'] = static::addAlertInformationForObjectIfAvailable($attributes['data'], $object);
        $attributes['data'] = static::addDeleteInformationForObjectIfAvailable($attributes['data'], $object);

        return $attributes;
    }

    private static function generateUID(DataObject $object)
    {
        $baseClassName = DataObject::getSchema()->baseDataClass($object->ClassName);
        $id = $object->ID;
        return hash('md5', "{$baseClassName}_{$id}");
    }

    private static function addPublishedDataForObjectIfAvailable(array $data, DataObject $object)
    {
        if ($object->hasExtension(Versioned::class)) {
            $data['published'] = $object->hasMethod('isLiveVersionRecursive') ?
                $object->isLiveVersionRecursive() : $object->isLiveVersion();
        }

        return $data;
    }

    private static function addAlertInformationForObjectIfAvailable(array $data, DataObject $object)
    {
        if ($object instanceof Alerts) {
            $alerts = array_filter((array) $object->getFreedomAlerts());
            if (count($alerts)) {
                $data['alerts'] = $alerts;
            }
        }

        return $data;
    }

    private static function addDeleteInformationForObjectIfAvailable(array $data, DataObject $object)
    {
        $data['canDelete'] = $object->canDelete();
        if ($object->hasMethod('canUnpublish')) {
            $data['canDelete'] = $data['canDelete'] && $object->canUnpublish();
        }

        if ($object instanceof ConditionalDeleteMethod) {
            $deleteMethod = $object->getFreedomDeleteMethod();
            if (array_search($deleteMethod, ['delete', 'unlink']) !== false) {
                $data['deleteMethod'] = $deleteMethod;
            }
        }

        return $data;
    }

    private function hasDbField($fieldName)
    {
        return isset($this->dbFields()[$fieldName]);
    }

    private function dbFields()
    {
        return $this->owner->config()->get('db');
    }

    private function attributesForDbField($fieldName)
    {
        if (!$this->owner->canEdit()) {
            return [];
        }

        $attributes = ['field' => $fieldName];
        $manualType = $this->fieldEditorTypeFor($fieldName);
        if ($manualType) {
            $attributes['data'] = ['type' => $manualType];
        } else {
            $attributes['data'] = $this->getDataForFieldByAutoDetection($fieldName);
        }

        return $attributes;
    }

    private function fieldEditorTypeFor($fieldName)
    {
        $configurations = $this->owner->config()->get('freedom_field_types');
        return isset($configurations[$fieldName]) ? $configurations[$fieldName] : null;
    }

    private function getDataForFieldByAutoDetection($fieldName)
    {
        $data = [];
        $field = $this->dbFields()[$fieldName];
        preg_match('`(?P<type>[^(]+)(?:\((?P<args>[^)]+)\))?`', $field, $parts);

        switch ($parts['type']) {
            case 'Int':
            case 'BigInt':
                $data['type'] = 'int';
                break;
            case 'Float':
            case 'Double':
            case 'Decimal':
                $data['type'] = 'float';
                break;
            case 'Date':
                $data['type'] = 'date';
                break;
            case 'Datetime':
                $data['type'] = 'datetime';
                break;
            case 'Time':
                $data['type'] = 'time';
                break;
            case 'Varchar':
            case 'HTMLVarchar':
                $data['type'] = 'text';
                $data['maxLength'] = (int) explode(',', $parts['args'])[0];
                break;
            case 'Text':
                $data['type'] = 'text';
                break;
            case 'HTMLText':
                $data['type'] = 'html';
                break;
        }

        return $data;
    }

    private function hasRelation($relationName)
    {
        return (bool) $this->owner->getRelationType($relationName);
    }

    private function attributesForRelation($relationName)
    {
        $relation = $this->owner->{$relationName}();
        if ($relation instanceof DataObject) {
            return $this->attributesForObject($relation);
        }

        $relationDataClass = $this->owner->{$relationName}()->dataClass();
        $relationObject = Injector::inst()->get($relationDataClass);

        if ($relation instanceof HasManyList) {
            $sortable = (bool)SS_Config::inst()->get($relationDataClass, 'default_sort');
            $removeMethod = 'delete';
        } else if ($relation instanceof ManyManyList) {
            $sortable = (bool)SS_Config::inst()->get($relation->getJoinTable(), 'default_sort');
            $removeMethod = 'unlink';
        } else {
            $sortable = false;
        }

        $data = [
            'canAdd' => $relationObject->canCreate(),
            'canSort' => $sortable,
            'removeMethod' => $removeMethod
        ];

        return [
            'relation' => $relationName,
            'data' => $data
        ];
    }

    private function asHTML($text)
    {
        $object = DBHTMLText::create();
        $object->setValue($text);
        return $object;
    }
}
