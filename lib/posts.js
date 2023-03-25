import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(),'posts');

export function getSortedPostsData() {
	
	const fileNames = fs.readdirSync(postsDirectory);
	const allPostsData = fileNames.map( filename => {
		//removes the .md from the filename for the id e.g. 'pre-rendering' and 'ssg-ssr'
		const id = filename.replace(/\.md$/, '');

		//read the markdown file as string
		const fullPath = path.join(postsDirectory, filename);
		const fileContents = fs.readFileSync(fullPath,'utf8');
		//use graymatter to parse metadata like title
		const matterResult = matter(fileContents);
		//return object with {id, ...metadata};
		return {id, ...matterResult.data};
	})

	return allPostsData.sort( (a,b) => {
		if(a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});

}

export function getAllPostIds() {
	const fileNames = fs.readdirSync(postsDirectory);

	// Returns an array that looks like this:
	// [
	//   {
	//     params: {
	//       id: 'ssg-ssr'
	//     }
	//   },
	//   {
	//     params: {
	//       id: 'pre-rendering'
	//     }
	//   }
	// ]
	return fileNames.map( fileName => {
		return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
	})
}
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory,`${id}.md`);
  const fileContents = fs.readFileSync(fullPath,'utf8');

  const matterResult = matter(fileContents);
  
  const processedContent = await remark()
  .use(html)
  .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return  {
	id,
	contentHtml,
	...matterResult.data
  }

}