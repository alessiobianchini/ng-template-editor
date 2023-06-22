import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
  <div class="container mt-5 border rounded p-0">
  <h1 class="bg-light text-center p-2">ANGULAR TEMPLATE EDITOR</h1>
  <div class="row p-3">
    <div class="col-md-4">
      <h3>Template</h3>
      <textarea [(ngModel)]='template' (ngModelChange)="updateText()" rows="5" cols="120"></textarea>
    </div>
    <div class="col-md-4">
      <h3>Preview</h3>
      <div class="preview bg-light rounded border p-2" [innerText]="outputText"></div>
    </div>
    <div class="col-md-4">
      <h3>Parameters editor</h3>
      <form [formGroup]="editorData">
        <div formArrayName="placeholders" 
            *ngFor="let arrayItem of fieldsAvailable; let i=index">
              
            <input [id]="arrayItem.key" type="text"
              [formControl]="$any(getControl(i))">

            <label [for]="arrayItem.key" class="array-item-title">
              {{arrayItem.key}}</label>
        </div>
      </form>
    </div>
    <div class="col-md-4">
      <h3>Add parameter</h3>
      <input #param/>
      <button (click)="addParameter(param.value)" >Add</button>
    </div>
  </div>
</div>

  `,
})
export class App {
  outputText: string = '';
  template: string = 'Hello #user_name#, email: #user_email#';
  editorData: any;
  placeholderKeyRegex = /\#(.*?)\#/g; // /{{([^}]*)}}/g;
  fieldsAvailable = [
    { key: 'user_name', value: 'John Doe' },
    { key: 'user_age', value: '20 years' },
    { key: 'user_email', value: 'john@mail.com' },
    { key: 'app_name', value: 'My App' },
    { key: 'app_url', value: 'https://google.com' },
  ];

  constructor(private _formBuilder: FormBuilder) {
    this.editorData = this._formBuilder.group({
      placeholders: this._formBuilder.array([]),
    });
  }
  ngOnInit() {
    this.extractKeys();
    this.editorData.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.updateText());
    if (this.template) {
      this.updateText();
    }
  }
  extractKeys() {
    var temp = this.template.match(this.placeholderKeyRegex);
    if (temp) {
      this.fieldsAvailable.forEach((stack, index) => {
        this.placeholderArray.push(this._formBuilder.control(stack.value));
      });
    }
  }
  getControl(index: number) {
    let array = this.editorData.get('placeholders') as FormArray;
    if (index >= array.length) {
      this.placeholderArray.push(this._formBuilder.control(''));
    }
    return (this.editorData.get('placeholders') as FormArray).at(index);
  }
  addParameter(key: string) {
    console.log(key);
    this.fieldsAvailable.push({ key: key, value: '' });
  }
  get placeholderArray() {
    return this.editorData.get('placeholders') as FormArray;
  }
  updateText() {
    if (this.template !== null) {
      this.outputText = this.template.replace(
        this.placeholderKeyRegex,
        (match: any, field: any) => {
          var index = this.fieldsAvailable.findIndex((f) => f.key == field);
          const ex = this.placeholderArray.at(index);
          if (ex) {
            return ex.value;
          }
          return match;
        }
      );
      this.outputText.trim();
    }
  }
  copyField(field: any) {
    console.log(field);
  }
}

bootstrapApplication(App);
