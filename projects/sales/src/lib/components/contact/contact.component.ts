import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { ContactsService } from '../../services/contacts/contacts.service';
import { Contact } from '../../models/contact';

import { CONTACTS } from '../../models/constants';
import { GENERAL_INFORMATION_GROUP, ADDRESS_INFORMATION_GROUP } from '../../models/form-ids';

import { LoggerService } from 'utils';

import { DialogService } from 'serendipity-components';

import {
  NAVIGATION_BAR_HEIGHT_DESKTOP,
  // NAVIGATION_BAR_HEIGHT_MOBILE,
  COMMAND_BAR_HEIGHT_DESKTOP,
  // COMMAND_BAR_HEIGHT_MOBILE,
  VIEW_BAR_HEIGHT_DESKTOP,
  // VIEW_BAR_HEIGHT_MOBILE,
  MARGIN_DESKTOP,
  // MARGIN_MOBILE,
  // MAT_XSMALL
} from '../../models/constants';

@Component({
  selector: 'sales-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  public containerHeight: number;

  // public id = 'MA==';
  public partyId: string;
  public item: Contact;

  protected subscriptions: Subscription[] = [];

  @ViewChild('contentContainer', {static: true})
  private tableContainer: ElementRef;

  public generalInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];
  public generalInformationGroup: FormGroup;

  public addressInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];
  public addressInformationGroup: FormGroup;

  private navBarHeight = NAVIGATION_BAR_HEIGHT_DESKTOP;
  private cmdBarHeight = COMMAND_BAR_HEIGHT_DESKTOP;
  private viewBarHeight = VIEW_BAR_HEIGHT_DESKTOP;
  private margin = MARGIN_DESKTOP;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private contactsService: ContactsService,
              private dynamicFormService: DynamicFormService,
              private dialogService: DialogService,
              private snackBar: MatSnackBar,
              private logger: LoggerService) { }

  public ngOnInit() {

    this.logger.info('ContactComponent: ngOnInit()');

    this.containerHeight = this.tableContainer.nativeElement.offsetHeight -
      (this.navBarHeight + this.cmdBarHeight + this.viewBarHeight + this.margin);

    // this.partyId = this.route.snapshot.paramMap.get('id');

    let paramSubscription: Subscription = new Subscription();
    this.subscriptions.push(paramSubscription);

    paramSubscription = this.route.paramMap.subscribe(params =>  {

      this.partyId = params.get('id');
      this.partyId = atob(this.partyId);

      this.subscribe();

    });

  }

  async subscribe() {

    this.logger.info('ContactComponent: subscribe()');

    this.generalInformationModel = await this.dynamicFormService.getFormMetadata(GENERAL_INFORMATION_GROUP);
    this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);

    this.addressInformationModel = await this.dynamicFormService.getFormMetadata(ADDRESS_INFORMATION_GROUP);
    this.addressInformationGroup = this.dynamicFormService.createGroup(this.addressInformationModel);

    let modelSubscription: Subscription = new Subscription();
    this.subscriptions.push(modelSubscription);

    modelSubscription = this.contactsService.findOne(this.partyId).subscribe(data => {

      this.logger.info('ContactsPage subscribe() data: ' + JSON.stringify(data));

      this.item = data;
      this.dynamicFormService.initGroup(this.generalInformationGroup, this.item);
      this.dynamicFormService.initGroup(this.addressInformationGroup, this.item.party.addresses[0]);
    });

  }

  protected unsubscribe(): void {

    this.logger.info('ContactComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngOnDestroy() {

    this.logger.info('ContactComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  //
  // Misc
  //

  public canDeactivate(): Observable<boolean> | boolean {

    // this.logger.info('ContactComponent: canDeactivate()');

    if (!this.isDirty() && this.isValid()) {
      return true;
    }

    return this.dialogService.openConfirm({
      title: 'Contact',
      message: 'Are you sure you want to leave this page?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed();

  }

  public isDirty() {

    // this.logger.info('ContactComponent - isDirty()');

    let dirty = false;

    if ((this.generalInformationGroup && this.generalInformationGroup.dirty) ||
        (this.addressInformationGroup && this.addressInformationGroup.dirty)) {
      dirty = true;
    }

    return dirty;
  }

  public isValid() {

    // this.logger.info('ContactComponent - isValid()');

    let valid = false;

    if (this.generalInformationGroup && this.generalInformationGroup.valid) {

      if (this.addressInformationGroup && this.addressInformationGroup.valid) {

        valid = true;
        // this.logger.info('valid: ' + valid);
      }

    }

    return valid;
  }

  public markAsPristine() {

    // this.logger.info('ContactComponent - markAsPristine()');

    if (this.generalInformationGroup) {
      this.generalInformationGroup.markAsPristine();
    }

    if (this.addressInformationGroup) {
      this.addressInformationGroup.markAsPristine();
    }

  }

  //
  // Command Bar events
  //

  public onNew() {

    this.logger.info('ContactPage: onNew()');

    // this.router.navigate([CONTACTS + '/MA==']);
    this.router.navigate([CONTACTS + '/new']);
  }

  public onSave() {

    this.logger.info('ContactPage: onSave()');

    this.markAsPristine();
    this.openSnackBar();
  }

  public onSaveAndClose() {

    this.logger.info('ContactPage: onSaveAndClose()');

    this.markAsPristine();
    this.openSnackBar();
    this.router.navigate([CONTACTS]);
  }

  public onDeactivate() {

    this.logger.info('ContactPage: onDeactivate()');

    this.dialogService.openConfirm({
      title: 'Contact',
      message: 'Are you sure you want to delete this contact?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed().subscribe(response => {

      // this.logger.info(`ContactPage onDeactivate() response: ${response}`);

      if (response) {

        this.logger.info('ContactPage onDeactivate() response: true');

        const subscription: Subscription = this.contactsService.delete(this.partyId).subscribe(() => {

          subscription.unsubscribe();

          this.router.navigate([CONTACTS]);

        });

      }

    });

  }

  public onClose() {

    this.logger.info('ContactPage: onClose()');

    this.router.navigate([CONTACTS]);
  }


  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('ContactPage: onCustomEvent()');

    this.dialogService.openAlert({
      title: 'Alert',
      message: JSON.stringify(event),
      closeButton: 'CLOSE'
    });

    // this.logger.info('event: ' + JSON.stringify(event));
  }

  private openSnackBar() {

    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 500,
      panelClass: 'crm-snack-bar'
    });

  }

}

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

/*
if (data.party.roles.length) {

  data.organisation = {
    name: data.party.roles[0].reciprocalPartyName,
    phoneNumber: data.phoneNumber
  };

}

this.item = { ...data };
*/
