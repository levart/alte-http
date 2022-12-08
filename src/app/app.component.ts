import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "./services/posts.service";
import {catchError, Subject, Subscription, takeUntil} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    title: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
  });

  posts: any[] = []

  // subscription: Subscription = new Subscription();
  sub$ = new Subject()

  error: string | null = null

  constructor(
    private postsService: PostsService
  ) {

  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.postsService.getAll()
      .pipe(
        takeUntil(this.sub$)
      )
      .subscribe((data: any) => {
        // console.log(data);
        this.posts = data;
      });
  }


  submit() {
    if (this.form.invalid) {
      return;
    }

    if (this.form.value.id) {
      this.update(this.form.value);
    } else {
      this.create(this.form.value);
    }

  }

  create(data: any) {
    this.postsService.create(data)
      .pipe(
        takeUntil(this.sub$)
      )
      .subscribe((data: any) => {
        this.getData();
      })
  }

  update(data: any) {
    this.postsService.update(data)
      .pipe(
        takeUntil(this.sub$),
        catchError((err) => {
          console.log(err);
          throw err.error.error;
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.getData();
        },
        error: (error: string) => {
          this.error = error;
        },
        complete: () => {
          console.log('complete');
        }
      })
  }

  edit(post: any) {
    this.form.patchValue(post);
  }

  delete(post: any) {
    this.postsService.delete(post.id)
      .pipe(
        takeUntil(this.sub$)
      )
      .subscribe((data: any) => {
        console.log(data);
        this.getData();
      })
  }

  status(post: any) {
    this.postsService.statusChange(post.id, !post.status)
      .pipe(
        takeUntil(this.sub$)
      )
      .subscribe((data: any) => {
        console.log(data);
        this.getData();
      })
  }

  ngOnDestroy(): void {
    this.sub$.next(null);
    this.sub$.complete();
  }
}
