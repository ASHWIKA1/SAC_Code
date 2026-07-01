# SAC developed by TIS Module Development Guide

This guide outlines the standard procedure for developing, registering, and integrating a new module into the SAC developed by TIS ecosystem, based on the **Dashboard Analytics (Nerve Center)** implementation.

## 1. Module Scaffolding

SAC developed by TIS uses the `nwidart/laravel-modules` package. To create a new module, you should create a folder in the `Modules/` directory with a standard structure:

- `Config/`: Configuration files.
- `Database/`: Migrations and seeds.
- `Entities/`: Eloquent models.
- `Http/`: Controllers, Middleware, and Requests.
- `Providers/`: Service Providers (Core, Route, Repository).
- `Resources/`: Blade views and assets.
- `Routes/`: `web.php` and `api.php`.

### Important Files
- `module.json`: Standard Laravel-Modules manifest.
- `<ModuleName>.json`: SAC developed by TIS-specific manifest used by the **Module Manager**.

---

## 2. Module Registration

A module must be registered in three places to be fully recognized by the system:

### A. `modules_statuses.json`
Located in the root directory. Add your module name with a boolean status:
```json
{
    "DashboardAnalytics": true
}
```

### B. `infix_module_managers` Table
Register the module in the database so it appears in the **Module Manager** UI.
- Use `php artisan tinker` or a migration to insert:
  - `name`: Module name (e.g., `DashboardAnalytics`)
  - `email`: `user@sac developed by TIS.com` (Placeholder)
  - `notes`: Module description.
  - `version`: Version string (e.g., `1.0.0`).
  - `purchase_code`: `sac_developed_by_tis` (If nulled).
  - `addon_url`: External URL if applicable.
  - `is_default`: `0` (for custom modules).

### C. `<ModuleName>.json` file
Crucial for the Module Manager's sidebar interaction. Ensure the JSON structure is exactly:
```json
{
    "DashboardAnalytics": {
        "versions": ["1.0.0"],
        "url": ["localhost"],
        "notes": ["Module description here."]
    }
}
```

---

## 3. Sidebar Integration (`sm_menus`)

To make the module visible in the sidebar, add an entry to the `sm_menus` table.
- **Section ID**: `1` (Dashboard), `2` (Admin), etc.
- **Route**: Use a **named route** (e.g., `dashboardanalytics`).
- **Parent ID**: `0` for top-level, or a specific ID for sub-menus.

> [!IMPORTANT]
> Always use `validRouteUrl()` in sidebar templates to ensure the route is correctly resolved.

---

## 4. Routing & Middleware

### Named Routes
You **MUST** provide a name to your routes using `->name('route_name')`.
If a name is missing, SAC developed by TIS's sidebar helper will assume the route is broken and fallback to a generic handler, often causing "Class not found" errors for missing entity classes like `CustomMenu`.

### Middleware Grouping
To use core features like `general_settings` (for site logo, theme, etc.), you must wrap your routes with the `subdomain` middleware.
```php
Route::group(['middleware' => ['auth', 'subdomain']], function () {
    Route::get('/dashboardanalytics', 'DashboardAnalyticsController@index')->name('dashboardanalytics');
});
```
- **`auth`**: Ensures the user is logged in.
- **`subdomain`**: Injects `general_settings` and `school_config` into the Laravel service container.

---

## 5. UI Consistency

SAC developed by TIS uses a specific UI library (MetisMenu, Chart.js, ApexCharts). When building Blade views:
- Extend `backEnd.master`.
- Use standard layout sections: `@section('mainContent')`.
- Reuse existing CSS classes for KPI cards: `.white-box`, `.single-report-admit`.

---

## 6. Nulling Logic (If Applicable)

If you are developing for a "Nulled" environment:
- Ensure `app/Envato/Envato.php` is shimmed to return `true` for all license checks.
- Bypassing the `sm_general_settings` purchase code columns for the specific module name is often required to avoid "License Invalid" redirects.
