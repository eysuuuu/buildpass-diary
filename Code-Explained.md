Hi James and team!

I have able to study the code and saw that graphql schema are already setup together with the static data for the Diary logs

I have able to create a new landing page /site-diary which to where i redirected the user upon going to the root.

I didn’t change the way it was fetched using PreloadQuery, I just updated the query string to fetch all the details. Please note that I tried to prioritize intuitiveness and since it just a test and small data I fetched all the fields because I want to maximize the info that can be displayed thats why you might see I also have a minimized static query that i orignally used to display less data for a faster api response

I sticked to using shadcn for all the UI maximized tailwind for to add up more style. Used cursor ai for text generation on my guides.

For the "New Entry" form, I used the uploadthing as the photo storage, This was the first time that I have used it thats why I tried to read documentation and created my account with them. I also utilized Cursor AI to setup it for me after I updated my .env for the API Keys

Now on saving of new Entry, I have noticed that createDiary mutation is already setup so I just updated its input to also capture the inputs for the remaining fields

Instead of appending on the static list, I opted to do the persisting data to actually saved data on the mutation. I haven't setup the Postgresql so I cannot use Prisma, and because of that I resorted to using Cloud based NoSQL (MongoDB) to store my data. With that I want to apologise as I know that the team prefered using SQL based data and I haven't tried to setup postgresql from the start so I choose to avoid unexpected conflict in setting up and messing the time that can affect my delivery date

I also updated the query to use saved data on MongoDB rather than using the static data

After making few tweaks on UI Improvement like setting up intuitive item card for my list and setting up popover for both Photos and Attendees, I utilized Cursor AI to improve my ui and add more guide for the user.

I pushed my code to github publicly for the team to see it and deploy it into vercel to actually test it out without setting up the codebase.

Note : I haven't been able to create the AI powered feature like Description enhancement and Summary, I planned to used static data to mock api response for that and display it but I did'nt feel that it was the right thing to do so I skipped doing that part.
