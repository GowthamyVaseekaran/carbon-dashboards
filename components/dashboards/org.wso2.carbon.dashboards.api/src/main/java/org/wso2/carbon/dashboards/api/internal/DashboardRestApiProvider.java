/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.dashboards.api.internal;

import org.osgi.framework.BundleContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.wso2.carbon.dashboards.core.DashboardMetadataProvider;
import org.wso2.carbon.dashboards.core.WidgetMetadataProvider;
import org.wso2.carbon.uiserver.api.App;
import org.wso2.carbon.uiserver.spi.RestApiProvider;
import org.wso2.msf4j.Microservice;

import java.util.HashMap;
import java.util.Map;

/**
 * Provider that supplies Microservices for the {@link #DASHBOARD_PORTAL_APP_NAME} web app.
 *
 * @since 4.0.0
 */
@Component(service = RestApiProvider.class,
           immediate = true)
public class DashboardRestApiProvider implements RestApiProvider {

    public static final String DASHBOARD_PORTAL_APP_NAME = "portal";
    private static final Logger LOGGER = LoggerFactory.getLogger(DashboardRestApiProvider.class);

    private DashboardMetadataProvider dashboardDataProvider;
    private WidgetMetadataProvider widgetMetadataProvider;

    @Activate
    protected void activate(BundleContext bundleContext) {
        LOGGER.debug("{} activated.", this.getClass().getName());
    }

    @Deactivate
    protected void deactivate(BundleContext bundleContext) {
        LOGGER.debug("{} deactivated.", this.getClass().getName());
    }

    @Reference(service = DashboardMetadataProvider.class,
               cardinality = ReferenceCardinality.MANDATORY,
               policy = ReferencePolicy.DYNAMIC,
               unbind = "unsetDashboardMetadataProvider")
    protected void setDashboardMetadataProvider(DashboardMetadataProvider dashboardDataProvider) {
        this.dashboardDataProvider = dashboardDataProvider;
        LOGGER.debug("DashboardMetadataProvider '{}' registered.", dashboardDataProvider.getClass().getName());
    }

    protected void unsetDashboardMetadataProvider(DashboardMetadataProvider dashboardDataProvider) {
        this.dashboardDataProvider = null;
        LOGGER.debug("DashboardMetadataProvider '{}' unregistered.", dashboardDataProvider.getClass().getName());
    }

    @Reference(service = WidgetMetadataProvider.class,
               cardinality = ReferenceCardinality.MANDATORY,
               policy = ReferencePolicy.DYNAMIC,
               unbind = "unsetWidgetMetadataProvider")
    protected void setWidgetMetadataProvider(WidgetMetadataProvider widgetMetadataProvider) {
        this.widgetMetadataProvider = widgetMetadataProvider;
        LOGGER.debug("WidgetMetadataProvider '{}' registered.", widgetMetadataProvider.getClass().getName());
    }

    protected void unsetWidgetMetadataProvider(WidgetMetadataProvider widgetMetadataProvider) {
        this.widgetMetadataProvider = null;
        LOGGER.debug("WidgetMetadataProvider '{}' registered.", widgetMetadataProvider.getClass().getName());
    }

    @Override
    public String getAppName() {
        return DASHBOARD_PORTAL_APP_NAME;
    }

    @Override
    public Map<String, Microservice> getMicroservices(App app) {
        Map<String, Microservice> microservices = new HashMap<>(2);
        microservices.put(DashboardRestApi.API_CONTEXT_PATH, new DashboardRestApi(dashboardDataProvider));
        widgetMetadataProvider.setDashboardApp(app);
        microservices.put(WidgetRestApi.API_CONTEXT_PATH, new WidgetRestApi(widgetMetadataProvider));
        return microservices;
    }
}
