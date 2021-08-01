import { Length, Min, Max, MaxLength, ArrayMaxSize } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class NewTreeInput {
  @Field()
  @MaxLength(100)
  name!: string;

  @Field({ nullable: true })
  treeData?: string;

  @Field({ nullable: true })
  tags?: string;

  @Field()
  @MaxLength(10)
  language?: string;
}

// @ArgsType()
// export class TreeArgs {
//   @Field((type) => Int)
//   @Min(0)
//   skip: number = 0;

//   @Field((type) => Int)
//   @Min(1)
//   @Max(50)
//   take: number = 25;
// }
