import { AfterViewInit, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * BaseComponent to handle common component's method
 */
export class BaseComponent implements OnDestroy, OnInit, AfterViewInit, OnChanges {

  public subscriptions: Subscription [] = [];

  /**
   * method to be called for onInit in child component
   */
  init() {
    // method can be overridden
  }

  /**
   * method to be called for onChange in child component
   */
  onChange(data) {
    // method can be overridden
  }

  /**
   * method to be called for AfterViewInit in child component
   */
  viewInit() {
    // method can be overridden
  }

  /**
   * method to destroy the subscription
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub ? sub.unsubscribe() : '');
  }

  /**
   * method to initialize the component
   */
  ngOnInit(): void {
    this.init();
  }

  /**
   * method to be called when input property changes
   */
  ngOnChanges(data: SimpleChanges): void {
    this.onChange(data);
  }
  /**
   * method to be invoked after view has been initialized
   */
  ngAfterViewInit(): void {
    this.viewInit();
  }

}
