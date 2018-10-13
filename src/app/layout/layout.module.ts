import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FileUploadModule } from 'ng2-file-upload';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { ChartComponent } from '../chart/chart.component';
import { TableComponent } from '../table/table.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './layout.component';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

const routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: LayoutComponent, children: [
        { path: '', component: DashboardComponent },
        { path: 'chart', component: ChartComponent },
        { path: 'table', component: TableComponent }
    ]}
];

@NgModule({
    declarations: [
        LayoutComponent,
        DashboardComponent,
        ChartComponent,
        TableComponent
    ],
    imports: [
        FormsModule,
        RouterModule.forChild(routes),
        FileUploadModule,
        SharedModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        CommonModule
    ],
    providers: []
})

export class LayoutModule {

}