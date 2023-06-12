import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './components/alerts/alerts.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { InfobarComponent } from './components/infobar/infobar.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { SectionComponent } from './components/section/section.component';
import { SidebarDialogComponent } from './components/sidebar-dialog/sidebar-dialog.component';
import { StatusbarComponent } from './components/statusbar/statusbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { UploaderComponent } from './components/uploader/uploader.component';

import { SourceFileComponent } from './components/infobar/source-file/source-file.component';
import { GrayscaleComponent } from './components/toolbar/grayscale/grayscale.component';
import { GrayscaleManualComponent } from './components/toolbar/grayscale-manual/grayscale-manual.component';
import { InvertComponent } from './components/toolbar/invert/invert.component';

import { ShowComponentPipe } from './pipes/show-component.pipe';
import { SourceFilePipe } from './pipes/source-file.pipe';
import { SummaryPipe } from './pipes/summary.pipe';
import { GrayscalePipe } from './pipes/grayscale.pipe';
import { InvertPipe } from './pipes/invert.pipe';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AlertComponent,
    AppComponent,
    CanvasComponent,
    InfobarComponent,
    MenubarComponent,
    SectionComponent,
    SidebarDialogComponent,
    StatusbarComponent,
    ToolbarComponent,
    UploaderComponent,
    SourceFileComponent,
    GrayscaleComponent,
    GrayscaleManualComponent,
    InvertComponent,
    ShowComponentPipe,
    SourceFilePipe,
    SummaryPipe,
    GrayscalePipe,
    InvertPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
