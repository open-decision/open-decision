import * as React from "react";

import { Meta, Story } from "@storybook/react";
import {
  styled,
  Gallery as GalleryComponent,
  GalleryContainerProps,
} from "@open-decision/design-system";

export default {
  component: GalleryComponent.Container,
  title: "Components/Gallery",
} as Meta;

const Image = styled("img", {
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const Gallery: Story<GalleryContainerProps> = (props) => (
  <GalleryComponent.Container {...props}>
    <GalleryComponent.Set>
      <Image src="https://images.unsplash.com/photo-1627532273719-82c085c840ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=802&q=80"></Image>
      <Image src="https://images.unsplash.com/photo-1627532273719-82c085c840ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=802&q=80"></Image>
      <Image src="https://images.unsplash.com/photo-1627532273719-82c085c840ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=802&q=80"></Image>
      <Image src="https://images.unsplash.com/photo-1627532273719-82c085c840ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=802&q=80"></Image>
    </GalleryComponent.Set>
    <GalleryComponent.Set>
      <Image src="https://images.unsplash.com/photo-1627532273719-82c085c840ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=802&q=80"></Image>
      <Image src="https://images.unsplash.com/photo-1627532273719-82c085c840ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=802&q=80"></Image>
      <Image src="https://images.unsplash.com/photo-1627532273719-82c085c840ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=802&q=80"></Image>
      <Image src="https://images.unsplash.com/photo-1627532273719-82c085c840ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=802&q=80"></Image>
    </GalleryComponent.Set>
  </GalleryComponent.Container>
);
