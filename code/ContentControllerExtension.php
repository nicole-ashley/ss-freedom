<?php

namespace NikRolls\SsFreedom;

use SilverStripe\CMS\Controllers\ContentController;
use SilverStripe\Core\Environment;
use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;

/**
 * @property ContentController owner
 */
class ContentControllerExtension extends Extension
{
    public function onAfterInit()
    {
        if (Config::isActive($this->owner->data())) {
            $tinyMceCloudApiKey = Environment::getEnv('TINY_MCE_CLOUD_API_KEY');
            $tinyMceConfigJson = Config::getTinyMceConfigJson();
            Requirements::javascript("https://cdn.tiny.cloud/1/{$tinyMceCloudApiKey}/tinymce/5/tinymce.min.js");
            Requirements::javascript('https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js');
            Requirements::javascript('nikrolls/ss-freedom: javascript/www/build/ss-freedom.js', ['async']);
            Requirements::css('nikrolls/ss-freedom: javascript/www/build/ss-freedom.css');
            Requirements::customScript("
                window.NikRolls = window.NikRolls || {};
                window.NikRolls.SsFreedom = {
                  configurations: {$tinyMceConfigJson}
                };                
                document.body.appendChild(document.createElement('ss-freedom-admin-widget'))
            ");
        }
    }
}
