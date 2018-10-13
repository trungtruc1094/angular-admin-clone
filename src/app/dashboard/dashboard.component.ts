import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { RecipeService } from '../shared/services/recipe.service';
import { Recipe } from '../models/recipe/recipe.model';
import { RecipeId } from '../models/recipe/recipeid.model';

declare var $: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  recipe: Recipe;
  recipes: RecipeId[];

  uploader: FileUploader;

  // Download URL
  downloadURL: string[] = [];

  constructor(private recipeService: RecipeService) {}


  ngOnInit() {
    this.uploader = new FileUploader({ url: '' });
    this.recipeService.getAllRecipes().subscribe(recipes => {
      this.recipes = recipes;
    })
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      console.log('jQuery dashboard ready');

      // Click add more to add new row
      var i = 1;
      $('#add').click(function () {
        i++;
        $('#dynamicList').append('<div class="form-row mb-1" id="row_' + i + '"><div class="col-md-5"><input type="text" class="form-control" id="inputIngredientName" aria-describedby="emailHelp" placeholder=""></div><div class="col-md-5"><input type="text" class="form-control" id="inputIngredientAmount" aria-describedby="emailHelp" placeholder=""></div><div class="col-md-1"><select id="inputIngredientsUnit" class="form-control"><option selected>Kg(s)</option><option>Gram(s)</option></select></div><div class="col-md-1"><button name="remove" id="' + i + '" class="btn btn-danger btn_remove">Remove</button></div></div>');
        $(document).on('click', '.btn_remove', function () {
          var button_id = $(this).attr("id");
          $('#row_' + button_id).remove();

        });
      })
    });
  }

  submitClick() {
    console.log('Submit click');
    const fileArr = this.uploader.queue;
    fileArr.forEach(element => {
      const file = element['_file'];
      this.recipeService.uploadImage(file).subscribe(res => {
        // console.log('res',res.url);
        this.downloadURL.push(res.url);
        if (this.downloadURL.length === fileArr.length) {
          this.uploadRecipe();
        }
      });
    });
  }

  // Upload recipe
  uploadRecipe() {
    console.log('Upload Recipe');
    console.log('url', this.downloadURL);
    const newRecipe = new Recipe('Tam',
      'Qua da',
      this.downloadURL
    );
    this.recipeService.addNewRecipe(newRecipe);
  }

  removeForm(){
    this.downloadURL = [];
  }
}

