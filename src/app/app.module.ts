import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './components/alerts/alerts.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { InfobarComponent } from './components/infobar/infobar.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { ModalComponent } from './components/modal/modal.component';
import { StatusbarComponent } from './components/statusbar/statusbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { UploaderComponent } from './components/uploader/uploader.component';

@NgModule({
  declarations: [
    AlertComponent,
    AppComponent,
    CanvasComponent,
    InfobarComponent,
    MenubarComponent,
    ModalComponent,
    StatusbarComponent,
    ToolbarComponent,
    UploaderComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
