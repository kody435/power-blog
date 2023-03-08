// [slug].tsx

import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../client";
import Image from "next/image";

function urlFor(source: any) {
  return imageUrlBuilder(client).image(source);
}

const Post = ({ post }: any) => {
  const {
    title = "Missing title",
    name = "Missing name",
    categories,
    authorImage,
  } = post;
  return (
    <article>
      <h1>{title}</h1>
      <span>By {name}</span>
      {categories && (
        <ul>
          Posted in
          {categories.map((category: any) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      )}
      {authorImage && (
        <div>
          <Image src={urlFor(authorImage).width(50).url()} alt="alt" />
        </div>
      )}
    </article>
  );
};

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  "name": author->name,
  "categories": categories[]->title,
  "authorImage": author->image
}`;

export async function getStaticPaths() {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug: any) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps(context: any) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params;
  const post = await client.fetch(query, { slug });
  return {
    props: {
      post,
    },
  };
}
export default Post;
