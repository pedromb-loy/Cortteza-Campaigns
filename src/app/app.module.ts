import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';
import { CampaignsComponent } from './campaigns/campaigns.component';

@NgModule({
  declarations: [
    AppComponent,
    CampaignsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SidebarModule,
    FooterModule,
    NavbarModule,
    FixedPluginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
