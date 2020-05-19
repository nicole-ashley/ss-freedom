<?php

namespace NikRolls\SsFreedom;

interface Alerts
{
    /**
     * Used to surface state about the object to the front-end editing system. Only the highest level is shown at any
     * one time, eg if there are warnings and info messages, only the warnings will be shown until they are resolved,
     * at which time the info messages will be shown.
     */
    public function getFreedomAlerts(): AlertsData;
}
