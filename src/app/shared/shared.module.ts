import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SideMenuComponent } from "./components/side-menu/side-menu.component";
import { TopNavigationComponent } from "./components/top-navigation/top-navigation.component";



@NgModule({
    declarations: [
        SideMenuComponent,
        TopNavigationComponent
    ],
    imports: [
        FormsModule
    ],
    exports: [
        SideMenuComponent,
        TopNavigationComponent
    ],
    providers: []
})

export class SharedModule {}