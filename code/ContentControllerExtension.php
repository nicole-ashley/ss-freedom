<?php

namespace NikRolls\SsFreedom;

use SilverStripe\Core\Extension;
use SilverStripe\Security\Permission;
use SilverStripe\View\Requirements;

class ContentControllerExtension extends Extension
{
    public function onAfterInit() {
        if (Permission::check('SSFREEDOM_EDIT')) {
            Requirements::javascript('public/resources/vendor/nikrolls/ss-freedom/javascript/dist/ss-freedom.js', ['async']);
            Requirements::css('public/resources/vendor/nikrolls/ss-freedom/javascript/dist/ss-freedom.css', 'screen');
        }
    }
}
