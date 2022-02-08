import { Component } from "solid-js";

export const Modal: Component = props => (
  <div class="fixed inset-0 z-30 grid place-items-center" style="z-index:30">
    {props.children}
  </div>
)
