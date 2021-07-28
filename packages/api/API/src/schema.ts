// import { Field, ObjectType, ID } from "type-graphql";
// import { Resolver, Query } from "type-graphql";
// import { TreeService } from "./graphql/TreeService";
// @ObjectType()
// class DecisionTree {
//   @Field((type) => ID)
//   id: string;
//   @Field()
//   name: string;
//   @Field()
//   @Field({ nullable: true })
//   tags?: string;
//   @Field({ nullable: true })
//   extraData?: string;
//   @Field({ nullable: true })
//   language?: string;
// }

// @Resolver(DecisionTree)
// class TreeResolver {
//   constructor(private treeService: TreeService) {}

//   @Query((returns) => DecisionTree)
//   async DecisionTree(@Arg("id") id: string) {
//     const recipe = await this.treeService.findById();
//     if (recipe === undefined) {
//       throw new RecipeNotFoundError(id);
//     }
//     return recipe;
//   }

//   @Query((returns) => [Recipe])
//   recipes(@Args() { skip, take }: RecipesArgs) {
//     return this.recipeService.findAll({ skip, take });
//   }

//   @Mutation((returns) => Recipe)
//   @Authorized()
//   addRecipe(
//     @Arg("newRecipeData") newRecipeData: NewRecipeInput,
//     @Ctx("user") user: User
//   ): Promise<Recipe> {
//     return this.recipeService.addNew({ data: newRecipeData, user });
//   }

//   @Mutation((returns) => Boolean)
//   @Authorized(Roles.Admin)
//   async removeRecipe(@Arg("id") id: string) {
//     try {
//       await this.recipeService.removeById(id);
//       return true;
//     } catch {
//       return false;
//     }
//   }
// }

// // owner: User;

// // type User {
// //   id: ID!
// //   name: String!
// //   email: String!
// //   DecisionTrees: [DecisionTree!]!
// // }
