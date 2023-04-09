import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { InfobarComponent } from './components/infobar/infobar.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { MessageComponent } from './components/message/message.component';
import { ModalComponent } from './components/modal/modal.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { StatusbarComponent } from './components/statusbar/statusbar.component';
import { UploaderComponent } from './components/uploader/uploader.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    InfobarComponent,
    MenubarComponent,
    MessageComponent,
    ModalComponent,
    StatusbarComponent,
    ToolbarComponent,
    UploaderComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
