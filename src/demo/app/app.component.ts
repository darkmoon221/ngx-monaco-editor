import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {MatOptionSelectionChange} from '@angular/material/core';
import { EditorModel, MonacoEditorConstructionOptions, MonacoEditorLoaderService } from '@kronscht/ngx-monaco-editor';
import { take, filter } from 'rxjs/operators';
import {
  colors,
  location,
} from './json-examples';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme = 'vs-dark';
  themes = ['vs', 'vs-dark', 'hc-black'];
  readOnlys = [true, false];
  options: MonacoEditorConstructionOptions = { theme: 'vs-dark', readOnly: false };

  typescriptCode = `export class Animals {
    private name: string;
    constructor(name) {
      this.name = name;
    }
  }`;
  simpleText = "hello world!";
  sqlRequest = "SELECT * FROM user;";
  modifiedSqlRequest = "SELECT * FROM user\nWHERE id = 1;"

  sqlRequestModel: EditorModel = {
    value: this.sqlRequest
  }

  modifiedSqlRequestModel: EditorModel = {
    value: this.modifiedSqlRequest
  }

  public reactiveForm: FormGroup;
  displayJson: boolean;
  modelUri: monaco.Uri;

  languages = ['sql', 'yaml', 'typescript'];
  selectedLanguage = 'sql';

  originalModel: EditorModel = {
    value: this.sqlRequest,
    language: 'sql'
  };

  modifiedModel: EditorModel = {
    value: this.modifiedSqlRequest,
    language: 'sql'
  };

  constructor(private fb: FormBuilder, private monacoLoader: MonacoEditorLoaderService) {
    this.reactiveForm = this.fb.group({
      code: [location],
      json: [colors]
    });
    this.registerJSONValidationSchema();
  }

  setOptions(option) {
    this.options = { ...this.options, ...option};
  }

  mergeOptions(moreOptions?) {
    return {
      ...this.options,
      ...moreOptions
    }
  }

  async registerJSONValidationSchema() {
    await this.monacoLoader.isMonacoLoaded$.pipe(filter(isLoaded => isLoaded), take(1)).toPromise();
    this.modelUri = monaco.Uri.parse("a://b/city.json"); // a made up unique URI for our model
    // configure the JSON language support with schemas and schema associations
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
         {
            uri: "http://myserver/city-schema.json", // id of the first schema
            fileMatch: ["city*.json"],
            schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                    city: {
                        enum: ["Paris", "Berlin", "Boardman"]
                    },
                    country: {
                      enum: ["France", "Germany", "United States"]
                    },
                    population: {
                      type: "integer"
                    }
                }
            }
        }]
    });
  }

  languageChanged(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      switch (event.source.value) {
        case 'sql':
          this.loadSqlModel();
          break;
        case 'typescript':
          this.loadTypescriptModel();
          break;
        case 'yaml':
          this.loadYamlModel();
          break;
        default:
          this.loadSqlModel();
      }
    }
  }

  loadSqlModel() {
    this.originalModel = {
      value: this.sqlRequest,
      language: 'sql'
    };

    this.modifiedModel = {
      value: this.modifiedSqlRequest,
      language: 'sql'
    };
  }

  loadTypescriptModel() {
    this.originalModel = {
      value: 'function add(x: number, y: number): number {\n' +
        '  return x + y;\n' +
        '}',
      language: 'typescript'
    };

    this.modifiedModel = {
      value: 'let add = function (x: number, y: number): number {\n' +
        '  return x + y;\n' +
        '};',
      language: 'typescript'
    };
  }

  loadYamlModel() {
    this.originalModel = {
      value: '# An employee record\n' +
        'name: Martin D\'vloper\n' +
        'job: Developer\n' +
        'skill: Elite\n' +
        'employed: True\n' +
        'foods:\n' +
        '  - Apple\n' +
        '  - Orange\n' +
        '  - Strawberry\n' +
        '  - Mango\n' +
        'languages:\n' +
        '  perl: Elite\n' +
        '  python: Elite\n' +
        '  pascal: Lame\n' +
        'education: |\n' +
        '  4 GCSEs\n' +
        '  3 A-Levels\n' +
        '  BSc in the Internet of Things',
      language: 'yaml'
    };

    this.modifiedModel = {
      value: '# An employee record\n' +
        'name: Martin D\'vloper\n' +
        'job: Developer\n' +
        'skill: Elite\n' +
        'employed: True\n' +
        'foods:\n' +
        '  - Apple\n' +
        '  - Orange\n' +
        '  - Strawberry\n' +
        '  - Mango\n' +
        'languages:\n' +
        '  xml: Elite\n' +
        '  typescript: Elite\n' +
        '  pascal: Lame\n' +
        'education: |\n' +
        '  4 GCSEs\n' +
        '  3 A-Levels\n' +
        '  BSc in the Internet of Things',
      language: 'yaml'
    };
  }
}
