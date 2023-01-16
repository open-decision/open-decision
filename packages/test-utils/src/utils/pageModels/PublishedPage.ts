import { TCreatePublishedTreeOutput } from "@open-decision/api-specification";
import { BrowserContext, Page } from "@playwright/test";
import { TreeFixture } from "../../fixtures/Tree";
import { UserFixture } from "../../fixtures/User";
import { RendererComponent } from "../componentModels/RendererComponent";
import { proxiedPlaywrightOD } from "../playwright/APIClient";
import { createDashboardPage } from "./DashboardPage";

export interface PublishedPageFixtures {
  Tree: TreeFixture;
  User: UserFixture;
}

export interface PublishedPageData {
  publishedTree: TCreatePublishedTreeOutput;
}

export class PublishedPage {
  page: Page;
  data: PublishedPageData;
  fixtures: PublishedPageFixtures;
  renderer: RendererComponent;
  constructor(
    page: Page,
    data: PublishedPageData,
    fixtures: PublishedPageFixtures
  ) {
    this.page = page;
    this.data = data;
    this.fixtures = fixtures;

    this.renderer = new RendererComponent(page);
  }

  async goto() {
    await this.page.goto(`/public/${this.data.publishedTree.uuid}`);
  }

  async cleanup() {
    await this.fixtures.Tree.cleanup();
    await this.fixtures.User.cleanup();
  }
}

export const createPublishedPage = async (page: Page, context: BrowserContext) => {
  const UserClass = new UserFixture();
  const TreeClass = new TreeFixture(await proxiedPlaywrightOD(page.request));
  const dashboardPage = await createDashboardPage(page, {
    Tree: TreeClass,
    User: UserClass,
  });

  await context.clearCookies()

  return new PublishedPage(
    page,
    { publishedTree: dashboardPage.trees.publishedTree },
    {
      Tree: TreeClass,
      User: UserClass,
    }
  );
};
