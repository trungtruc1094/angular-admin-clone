import { Recipe } from './recipe.model';

export class RecipeId extends Recipe {
    id: string;

    constructor(id: string, name: string, description: string, imagePath: string[]) {
        super(name, description, imagePath);
        this.id = id;
    }
}