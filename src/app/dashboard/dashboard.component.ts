import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';

declare var $: any;
// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  uploader: FileUploader;

  // Main Task
  task: AngularFireUploadTask;

  // Progress Monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<any>;
  downloadURLString: string;

  constructor(private afStorage: AngularFireStorage, private db: AngularFirestore) {
    this.uploader = new FileUploader({ url: '' });
  }


  ngOnInit() {
    
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
    console.log('Start uploading');
    // The file object
    const file = this.uploader.queue[this.uploader.queue.length - 1]['_file'];

    // Client-side validation
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type: ( ');
    }

    // The storage path
    const path = `test/${new Date().getTime()}_${file.name}`;

    // Totally optional metadate
    const customMetadata = { app: 'My AngularFire-powered PWA!' };

    // The main task
    this.task = this.afStorage.upload(path, file, { customMetadata });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          // this.db.collection('photos').add({ path, size: snap.totalBytes });
          console.log('Uploaded Successfully');
        }
      })
    );

    // The file's download URL
    const fileRef = this.afStorage.ref(path);
    this.task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((res) => {
          this.downloadURLString = res;
        });
      })
    ).subscribe();
  }
}

