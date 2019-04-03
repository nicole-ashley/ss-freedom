<?php

namespace NikRolls\SsFreedom;

use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataExtension;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBHTMLText;

class TemplateAugmentor extends DataExtension
{
    public function FreedomAttributes($for) {
        if (!$this->owner->canEdit()) {
            return '';
        }

        $attribute = null;

        if ($for === '$self') {
            $attribute = [
                'type' => 'object',
                'data' => $this->dataForCurrentObject()
            ];
        } else if ($this->hasDbField($for)) {
            $attribute = [
                'type' => 'field',
                'data' => $this->dataForDbField($for)
            ];
        }

        if ($attribute) {
            $type = $attribute['type'];
            $jsonData = json_encode($attribute['data']);
            return $this->asHTML("data-ss-freedom-$type='$jsonData'");
        }
    }

    private function dataForCurrentObject() {
        $output = [
            'class' => get_class($this->owner),
            'id' => $this->owner->ID,
        ];

        $relatedObjects = $this->findMultipleReferences();
        if (!empty($relatedObjects)) {
            $output['potentiallyReusedIn'] = $relatedObjects;
        }

        return $output;
    }

    private function findMultipleReferences() {
        $list = ArrayList::create();
        $list->merge($this->findRelatedObjectsFor('has_many'));
        $list->merge($this->findRelatedObjectsFor('many_many'));
        $list->merge($this->findRelatedObjectsFor('belongs_many_many'));

        $grouped = $this->groupRelatedObjectsByClass($list);
        $output = [];
        foreach ($grouped as $items) {
            $unique = $items->columnUnique('ID');
            if (count($unique) > 1) {
                $output[] = [
                    'type' => $items->first()->singular_name(),
                    'names' => $items->columnUnique('Title')
                ];
            }
        }
        return $output;
    }

    private function findRelatedObjectsFor($type) {
        $relationships = $this->owner->config()->get($type);
        $list = ArrayList::create();
        foreach ($relationships as $name => $class) {
            if ($this->owner->hasMethod($name)) {
                $list->merge($this->owner->$name());
            }
        }
        return $list;
    }

    private function groupRelatedObjectsByClass($list) {
        $output = [];
        foreach ($list as $item) {
            $itemClass = get_class($item);
            $outputList = isset($output[$itemClass]) ? $output[$itemClass] : ArrayList::create();
            $outputList->push($item);
            $output[$itemClass] = $outputList;
        }
        return $output;
    }

    private function hasDbField($fieldName) {
        return isset($this->dbFields()[$fieldName]);
    }

    private function dbFields() {
        return $this->owner->config()->get('db');
    }

    private function dataForDbField($fieldName) {
        $data = ['name' => $fieldName];
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
                $data['type'] = 'text';
                $data['maxLength'] = (int)$parts['args'];
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

    private function hasMany($relationshipName) {
        return $this->owner->getRelationType($relationshipName) === 'has_many';
    }

    private function hasManyMany($relationshipName) {
        $relationshipType = $this->owner->getRelationType($relationshipName);
        return $relationshipType === 'many_many' || $relationshipType === 'belongs_many_many';
    }

    private function asHTML($text) {
        $object = DBHTMLText::create();
        $object->setValue($text);
        return $object;
    }
}
