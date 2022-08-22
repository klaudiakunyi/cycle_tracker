import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'cycle',
        loadChildren: () => import('../pages/cycle/cycle.module').then( m => m.CyclePageModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('../pages/calendar/calendar.module').then( m => m.CalendarPageModule)
      },
      {
        path: 'add-symptoms',
        loadChildren: () => import('../pages/add-symptoms/add-symptoms.module').then( m => m.AddSymptomsPageModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('../pages/stats/stats.module').then( m => m.StatsPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../pages/settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: 'cycle',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
