import { Component, For, Show, createEffect } from "solid-js";

import { scaleLinear, max } from "d3";
import { axisBottom } from "d3-axis";
import { select } from "d3-selection";

import { fetchAPI } from "./lib/fetcher.js";
import { foodSelection, deleteFood } from "./store.js";

import { BarcodeScanner, BarcodeScannerFallBack } from "./lib/Scanner";
import { Logo } from "./lib/Logo";
import { ThemeToggle } from "./lib/ThemeToggle";

const nutriments = [
  "energy-kcal_100g",
  "carbohydrates_100g",
  "sugars_100g",
  "fat_100g",
  "saturated-fat_100g",
  "fiber_100g",
  "proteins_100g",
  "salt_100g",
  "sodium_100g",
  "carbon-footprint-from-known-ingredients_100g",
];

const App: Component = () => {
  return (
    <>
      <Header />
      <Show
        when={"BarcodeDetector" in window}
        fallback={<BarcodeScannerFallBack />}
      >
        <BarcodeScanner />

        <Show when={foodSelection().length} fallback={<NoSelection />}>
          <FoodList />
          <Plots />
        </Show>
      </Show>
    </>
  );
};

const Header: Component = () => {
  return (
    <header class="p-2 w-full mb-0.5 shadow dark:bg-slate-900 dark:shadow-slate-700 ">
      <div class="flex items-center gap-4 max-w-5xl mx-auto">
        <Logo />
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200 mr-auto whitespace-nowrap">
          Food comparator
        </h2>
        <ThemeToggle />
      </div>
    </header>
  );
};

const FoodList: Component = () => {
  return (
    <section class="sticky top-0 bg-white py-2 mb-2 center border-b dark:bg-slate-900 dark:border-slate-700">
      <ul class="max-w-3xl mx-auto flex gap-2 px-2">
        <For each={foodSelection()}>
          {(food) => (
            <li class="flex flex-wrap content-center">
              <Food product={food.product} />
            </li>
          )}
        </For>
      </ul>
    </section>
  );
};

const Food: Component = (props) => {
  const {
    image_thumb_url,
    _id: code,
    product_name,
    product_name_fr,
  } = props.product;
  return (
    <button class="group relative focus:outline-none">
      <img
        class="object-cover w-10 h-10 rounded-full border border-gray-100 shadow-sm"
        src={image_thumb_url}
        alt="img_brand"
      />
      <div
        class="hidden absolute top-0 left-7 h-2 w-2 border-1 border-white rounded-full bg-red-400 z-2 transform group-hover:scale-150 group-hover:block group-focus:scale-150 group-focus:block"
        onclick={() => deleteFood(code)}
      ></div>
      <div class="hidden absolute top-12 w-52 md:w-50 flex-col group-hover:flex group-focus:flex">
        <div class="w-full overflow-hidden inline-block">
          <div class="h-4 w-4 ml-3 border rotate-45 transform origin-bottom-left bg-white" />
        </div>

        <div class="p-2 text-left text-gray-600 border rounded shadow bg-white">
          {product_name || product_name_fr}
        </div>
      </div>
    </button>
  );
};

const NoSelection: Component = () => (
  <section class="flex flex-col m-8 text-lg font-extrabold text-slate-900 tracking-tight dark:text-slate-200 text-center">
    <span>No items scanned</span>
  </section>
);

const Plots: Component = () => {
  return (
    <section class="max-w-3xl mx-auto flex flex-col gap-10 px-2 mb-16">
      <For each={nutriments}>
        {(nutriment) => <Plot nutriment={nutriment} />}
      </For>
      <SvgPatterns />
    </section>
  );
};

const Plot: Component = (props) => {
  const height = 60,
    width = 500,
    margin = { top: 5, bottom: 5, left: 15, right: 15 },
    innerHeight = height - margin.top - margin.bottom,
    innerWidth = width - margin.left - margin.right;

  let xScale = scaleLinear()
    .domain([
      0,
      Math.max(
        max(
          foodSelection(),
          (food) => food.product?.nutriments?.[props.nutriment] * 1.1
        ),
        100
      ),
    ])
    .range([0, innerWidth]);

  const label = props.nutriment.replaceAll(/[-_]/gi, " ");
  return (
    <div class="flex flex-col text-gray-600 dark:text-gray-400 ">
      <svg
        class="h-full w-full"
        viewBox="0 0 500 70"
        preserveAspectRatio="none"
      >
        <g
          stroke-width=".5"
          transform={`translate(${margin.left},${margin.top})`}
        >
          <g>
            <For each={foodSelection()}>
              {(food) => (
                <Show when={food.product?.nutriments?.[props.nutriment]}>
                  <Point
                    code={food.code}
                    value={food.product.nutriments[props.nutriment]}
                  />
                </Show>
              )}
            </For>
            <Axis innerHeight={innerHeight} scale={xScale} />
          </g>
        </g>
      </svg>
      <span class="mx-auto text-xs md:text-sm font-extrabold capitalize">
        {label}
      </span>
    </div>
  );
};

const Axis: Component = (props) => {
  let g;

  createEffect(() => {
    select(g).selectAll("*").remove();
    let axis = axisBottom(props.scale).tickSizeOuter(0);
    select(g).call(axis);
  });
  return (
    <g
      class="axis"
      ref={g}
      transform={`translate(0, ${props.innerHeight - 20})`}
    />
  );
};

const SvgPatterns: Component = () => {
  return (
    <svg height="0" width="0">
      <defs>
        <For each={foodSelection()}>
          {(food) => (
            <pattern
              id={food.code}
              patternUnits="objectBoundingBox"
              x="0"
              y="0"
              height="1"
              width="1"
            >
              <image
                height="24"
                width="24"
                xlink:href={food.product.image_thumb_url}
                preserveAspectRatio="none"
              />
            </pattern>
          )}
        </For>
      </defs>
    </svg>
  );
};

const Point: Component = (props) => {
  return (
    <>
      <circle cx={props.value} cy="10" r="13" fill="white" />
      <circle cx={props.value} cy="10" r="12" fill={`url(#${props.code})`} />
    </>
  );
};

export default App;
