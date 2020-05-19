<?php

namespace NikRolls\SsFreedom;

use SilverStripe\Forms\FieldList;

interface OptionsFields
{
    public function getFreedomOptionsFields(): FieldList;
}
