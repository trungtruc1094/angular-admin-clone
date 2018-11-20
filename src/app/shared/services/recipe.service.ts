import { Injectable } from '@angular/core';

// Firebase
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

// Upload Module
import { FileUploader } from 'ng2-file-upload';

// Observables & Operators
import { Observable, Observer } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';

// Import class
import { Recipe } from '../../models/recipe/recipe.model';
import { RecipeId } from '../../models/recipe/recipeid.model';

@Injectable()
export class RecipeService {
    // Reference to Collection & Document on firebase
    recipeCollectionRef: AngularFirestoreCollection<Recipe>;
    recipeDocRef: AngularFirestoreDocument<Recipe>;
    recipes: Observable<RecipeId[]>;

    // Upload object from ng2-upload
    uploader: FileUploader;

    // Download URL
    downloadURL: string[];

    constructor(private afStore: AngularFireStorage, private db: AngularFirestore) {
        this.recipeCollectionRef = this.db.collection<Recipe>('recipes');
    }

    // Get all of recipes from recipes collection
    public getAllRecipes(): Observable<RecipeId[]> {
        // this.todoCollectionRef.valueChanges().subscribe(res => {
        //   this.todos = res;
        // });
        // this.recipes = this.recipeCollectionRef.snapshotChanges().pipe(
        //     map(actions => actions.map(a => {
        //         const data = a.payload.doc.data();
        //         // console.log('Date', data);
        //         const id = a.payload.doc.id;
        //         // console.log('Data', { id, ...data });
        //         return { id, ...data };
        //     }))
        // );
        this.recipes = this.recipeCollectionRef.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
        );

        return this.recipes;
    }

    // Add a new recipe
    public addNewRecipe(newRecipe: Recipe) {
        const object = JSON.parse(JSON.stringify(newRecipe));
        this.recipeCollectionRef.add(object);
    }

    // Upload image
    public uploadImage(file: File): Observable<{ url }> {
        // Check if uploaded file is image
        if (file.type.split('/')[0] !== 'image') {
            console.log('Error');
            return Observable.throw('Unsupported file');
        } else {
            return new Observable<{ url }>(observer => {
                console.log('Start uploading');
                // The storage path
                const path = `test/${new Date().getTime()}_${file.name}`;

                // Totally optional metadate
                const customMetadata = { app: 'My AngularFire-powered PWA!' };

                // Main Task for uploading data
                let task: AngularFireUploadTask;
                // Progress Monitoring
                let snapshot: Observable<any>;

                // task = this.afStore.upload(path, file, { customMetadata });
                // this.afStore.upload(path, file, { customMetadata }).snapshotChanges().pipe(
                //     finalize(() => {
                //         this.afStore.ref(path).getDownloadURL().toPromise()
                //         .then(res => {
                //             observer.next({url: res});
                //         })
                //     })
                // );

                // this.afStore.upload(path, file, { customMetadata }).snapshotChanges().toPromise()
                // .then(res => {
                //     if (res.bytesTransferred === res.totalBytes) {
                //         this.url = res.downloadURL
                //     }
                // })

                const fileRef = this.afStore.ref(path);
                snapshot = task.snapshotChanges();
                snapshot.pipe(
                    finalize(() => {
                        fileRef.getDownloadURL().subscribe((res) => {
                            observer.next({
                                url: res
                            });
                        });
                    })
                ).subscribe();
            });
        }
    }
}
