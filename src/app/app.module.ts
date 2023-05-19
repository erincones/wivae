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
import { SectionComponent } from './components/section/section.component';
import { StatusbarComponent } from './components/statusbar/statusbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { UploaderComponent } from './components/uploader/uploader.component';

import { FileInfoComponent } from './components/infobar/file-info/file-info.component';
import { GrayscaleComponent } from './components/toolbar/grayscale/grayscale.component';

import { FileInfoPipe } from './pipes/file-info.pipe';
import { SummaryPipe } from './pipes/summary.pipe';
import { GrayscalePipe } from './pipes/grayscale.pipe';

@NgModule({
  declarations: [
    AlertComponent,
    AppComponent,
    CanvasComponent,
    InfobarComponent,
    MenubarComponent,
    ModalComponent,
    SectionComponent,
    StatusbarComponent,
    ToolbarComponent,
    UploaderComponent,
    FileInfoComponent,
    GrayscaleComponent,
    FileInfoPipe,
    SummaryPipe,
    GrayscalePipe,
  ],
  imports: [BrowserModule, AppRoutingModule, FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
