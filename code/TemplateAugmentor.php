<?php

namespace NikRolls\SsFreedom;

use SilverStripe\Core\Config\Config as SS_Config;
use SilverStripe\Core\Convert;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataExtension;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\Versioned\RecursivePublishable;
use SilverStripe\Versioned\Versioned;

/**
 * @property DataObject owner
 */
class TemplateAugmentor extends DataExtension
{
    public function FreedomIsActive()
    {
        return Config::isAugmentationActive($this->owner);
    }

    public function FreedomAttributes($for = '$self', $hiddenWhenEmpty = false)
    {
        if (!$this->FreedomIsActive()) {
            return '';
        }

        $data = $this->getFreedomAttributes($for);

        if (!$data) {
            return '';
        }

        $jsonData = Convert::raw2att(json_encode($data['data']));
        $output = ["data-ss-freedom-{$data['type']}=\"$jsonData\""];

        if ($hiddenWhenEmpty) {
            $output[] = 'data-ss-freedom-hidden-when-empty';
        }

        return $this->asHTML(implode(' ', $output));
    }

    public function getFreedomAttributes($for = '$self')
    {
        $attribute = null;

        if ($for === '$self') {
            $attribute = [
                'type' => 'object',
                'data' => $this->dataForCurrentObject()
            ];
        } elseif ($this->hasDbField($for)) {
            $attribute = [
                'type' => 'field',
                'data' => $this->dataForDbField($for)
            ];
        } elseif ($this->hasRelation($for)) {
            $attribute = [
                'type' => 'relationship',
                'data' => $this->dataForRelation($for)
            ];
        }

        return $attribute;
    }

    public function isLiveVersionRecursive()
    {
        if ($this->owner->hasExtension(Versioned::class)) {
            $pageIsLive = $this->owner->isLiveVersion();

            $ownedNotLive = null;
            if ($this->owner->hasExtension(RecursivePublishable::class)) {
                $owned = $this->owner->findOwned();

                foreach ($owned as $item) {
                    if (!$item->isLiveVersion()) {
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

    private function dataForCurrentObject()
    {
        $data = [
            'class' => get_class($this->owner),
            'id' => $this->owner->ID,
            'hasOptions' => $this->owner instanceof ObjectOptionsFields
        ];

        $data = $this->addPublishedDataForObjectIfAvailable($data, $this->owner);
        $data = $this->addAlertInformationForObjectIfAvailable($data, $this->owner);

        return $data;
    }

    private function addPublishedDataForObjectIfAvailable(array $data, DataObject $object)
    {
        if ($object->hasExtension(Versioned::class)) {
            $data['published'] = $object->hasMethod('isLiveVersionRecursive') ?
                $object->isLiveVersionRecursive() : $object->isLiveVersion();
        }

        return $data;
    }

    private function addAlertInformationForObjectIfAvailable(array $data, DataObject $object)
    {
        if ($object instanceof ObjectAlerts) {
            $alerts = array_filter((array)$object->getObjectAlerts());
            if (count($alerts)) {
                $data['alerts'] = $alerts;
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

    private function dataForDbField($fieldName)
    {
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
            case 'HTMLVarchar':
                $data['type'] = 'text';
                $data['maxLength'] = (int)explode(',', $parts['args'])[0];
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
        return (boolean)$this->owner->getRelationType($relationName);
    }

    private function dataForRelation($relationName)
    {
        $data = [
            'name' => $relationName,
            'type' => $this->owner->getRelationType($relationName)
        ];

        if ($data['type'] === 'has_many') {
            $schema = $this->owner->getSchema();
            $hasManyComponent = $schema->hasManyComponent($this->owner->getClassName(), $relationName, true);
            $data['sort'] = SS_Config::inst()->get($hasManyComponent, 'default_sort');
        } elseif ($data['type'] === 'many_many') {
            $schema = $this->owner->getSchema();
            $manyManyComponent = $schema->manyManyComponent($this->owner->getClassName(), $relationName);
            $data['sort'] = SS_Config::inst()->get($manyManyComponent['join'], 'default_sort');
            $data['sort'] = preg_replace('`^"' . $manyManyComponent['join'] . '"\.`i', '', $data['sort']);
        }

        if (isset($data['sort'])) {
            preg_match(
                '`"?(?<field>[^"]+)"?(?:\s+(?<direction>ASC|DESC))?`i',
                $data['sort'],
                $sortParts
            );
            $sortParts['direction'] = isset($sortParts['direction']) ? $sortParts['direction'] : 'ASC';
            $data['sort'] = [
                'field' => $sortParts['field'],
                'direction' => strtolower($sortParts['direction']) === 'desc' ? 'descending' : 'ascending'
            ];
        }

        return $data;
    }

    private function asHTML($text)
    {
        $object = DBHTMLText::create();
        $object->setValue($text);
        return $object;
    }
}
