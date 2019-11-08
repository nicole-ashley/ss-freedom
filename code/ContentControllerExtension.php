<?php

namespace NikRolls\SsFreedom;

use SilverStripe\CMS\Controllers\ContentController;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Environment;
use SilverStripe\Core\Extension;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Security\Permission;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\Requirements;
use SilverStripe\View\SSViewer;

/**
 * @property ContentController owner
 */
class ContentControllerExtension extends Extension
{
    public function onAfterInit()
    {
        if (Config::isWidgetActive($this->owner->data())) {
            $tinyMceCloudApiKey = Environment::getEnv('TINY_MCE_CLOUD_API_KEY');
            $tinyMceConfigJson = Config::getTinyMceConfigJson();
            Requirements::javascript("https://cdn.tiny.cloud/1/{$tinyMceCloudApiKey}/tinymce/5/tinymce.min.js");
            Requirements::javascript('https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js');
            Requirements::javascript('nikrolls/ss-freedom: javascript/www/build/ss-freedom.js', ['async']);
            Requirements::css('nikrolls/ss-freedom: javascript/www/build/ss-freedom.css');
            $adminWidgetHtml = SSViewer::execute_template(
                'SsFreedomAdminWidget',
                $this->owner,
                ['CurrentVersionedStage' => Versioned::get_stage()]
            );
            Requirements::customScript(
                "window.NikRolls = window.NikRolls || {};
                window.NikRolls.SsFreedom = {
                  configurations: {$tinyMceConfigJson}
                };
                document.body.innerHTML += `{$adminWidgetHtml}`;"
            );
        }
    }

    public function canAccessCMS()
    {
        return Permission::check('CMS_ACCESS_CMSMain');
    }
}
