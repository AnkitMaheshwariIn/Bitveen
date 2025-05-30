import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LimitedMultiSelect from '../../Common/Providers/LimitedMultiSelect';

export const AddTopics = (props) => {

  // const[loading, setLoading] = useState(false)
  // const[errorText, setErrorText] = useState("")

  const selectedTopicsCategory = props.selectedTopicsCategory ? props.selectedTopicsCategory : [];
  const setSelectedTopicsCategory = props.setSelectedTopicsCategory;

  const topicsCategoryErr = props.topicsCategoryErr;
  const setTopicsCategoryErr = props.setTopicsCategoryErr;

  const selectedTopics = props.selectedTopics ? props.selectedTopics : [];
  const setSelectedTopics = props.setSelectedTopics;
 
  const topicsErr = props.topicsErr;
  const setTopicsErr = props.setTopicsErr;
  
  const selectedSubTopics = props.selectedSubTopics ? props.selectedSubTopics : [];
  const setSelectedSubTopics = props.setSelectedSubTopics;

  const subTopicsErr = props.subTopicsErr;
  const setSubTopicsErr = props.setSubTopicsErr;

  // const top100Topics = [
  //   'Health', 'Business', 'Education', 'Art', 'Culture', 'Entrepreneurship', 'Contests',
  //   'Book', 'Movie', 'Music', 'Celebrity', 'Teaching', 'Games', 'Sports', 'Fitness', 'Pet',
  //   'Wellness', 'Travel', 'Food', 'Restaurant', 'Nutrition', 'Gardening', 'News', 'Tech',
  //   'Programming', 'Marketing', 'Photography', 'Environmental', 'Interior Design', 'Automotive',
  //   'Fun', 'School', 'Kids', 'Parental', 'Youngster', 'Politics', 'Beauty', 'Makeup', 'Recipes',
  //   'Interviews', 'Charity', 'Product', 'Automation', 'AI', 'Artificial intelligence', 'Machine Learning',
  //   'Advice', 'Productivity', 'History', 'Gifs', 'Internet', 'Infographics', 'Crypto', 'Social Media',
    
  //   'Javascript', 'React', 'React.js', 'React Native', 'Angular', 'Vue.js', 'Express.js', 'Jquery',
  //   'Ionic', 'Ember.js', 'Meteor.js', 'Mithril', 'Node.js', 'Aurelia', 'Backbone.js', 'Svelte', 
  //   'Alpine.js', 'Next.js', 'Nuxt', 'Gatsby', 'Jest', 'Mocha', 'Storybook', 'Cypress', 'Jasmine', 
  //   'Material UI', 'Flutter', 'Angular Material', 'Selenium', 'PrimeNG', 'Pandas', 'Bootstrap', 'Foundation', 
  //   'Tailwind', 'Materialize', 'Semantic UI', 'Polymer', 'Vuetify', 'Skeleton',
  //   'Python', 'Go', 'Java', 'Kotlin', 'PHP', 'C#', 'Swift', 'R', 'Ruby', 'C and C++', 'Matlab', 'TypeScript',
  //   'Scala', 'SQL', 'HTML', 'CSS', 'NoSQL', 'Rust', 'Perl'
  // ].sort()

  const topicsCategory = ["Life", "Self Improvement", "Work", "Technology","Software Development", "Database", "Media", "Society", "Culture", "World"];

  const topicsSubTopics = {
    "Life": {
      "Family" : ["Adoption", "Children", "Elder Care", "Fatherhood", "Motherhood", "Parenting", "Pregnancy", "Seniors"],
      "Health": ["Aging", "Coronavirus", "Coronavirus", "Covid-19", "Death And Dying", "Disease", "Fitness", "Mens Health", "Nutrition", "Sleep", "Trans Healthcare", "Vaccines", "Weight Loss", "Womens Health"],
      "Home": ["Architecture", "Home Improvement", "Homeownership", "Interior Design", "Rental Property", "Vacation Rental"],
      "Food": ["Baking", "Coffee", "Cooking", "Foodies", "Restaurants", "Tea"],
      "Pets": ["Cats", "Dog Training", "Dogs", "Hamsters", "Horses", "Pet Care"],
      "Relationships": ["Friendship"]
    },

    "Self Improvement": {
      "Mental Health": ["Anxiety", "Counseling", "Grief","Life Lessons", "Self-awareness", "Stress", "Therapy", "Trauma"],
      "Productivity": ["Career Advice", "Coaching", "Goal Setting", "Morning Routines", "Pomodoro Technique", "Pomodoro Technique", "Time Management", "Time Management", "Work Life Balance"],
      "Mindfulness": ["Guided Meditation", "Journaling", "Meditation", "Transcendental Meditation", "Yoga"]
    },

    "Work": {
      "Business": ["Entrepreneurship", "Freelancing", "Small Business", "Startups", "Venture Capital"],
      "Marketing": ["Advertising", "Branding", "Content Marketing", "Content Strategy", "Digital Marketing", "SEO", "Social Media Marketing", "Storytelling For Business"],
      "Leadership": ["Employee Engagement", "Leadership Coaching", "Leadership Development", "Management", "Meetings", "Org Charts", "Thought Leadership"],
      "Remote Work": ["Company Retreats", "Digital Nomads", "Distributed Teams", "Future Of Work", "Work From Home"]
    },

    "Technology": {
      "Artificial Intelligence": [ "ChatGPT", "Conversational AI", "Deep Learning", "Large Language Models","Machine Learning", "NLP", "Voice Assistant" ],
      "Blockchain": ["Bitcoin", "Cryptocurrency", "Decentralized Finance", "Ethereum", "Nft", "Web3"],
      "Data Science": ["Analytics", "Data Engineering", "Data Visualization", "Database Design", "Sql"]
    },

    "Software Development": {
      "Programming": ["Android Development", "Coding", "Flutter", "Frontend Engineering", "iOS Development", "Mobile Development", "Software Engineering", "Web Development"],
      "Programming Languages": ["Angular", "CSS", "HTML", "Java", "JavaScript", "Nodejs", "Python", "React", "Ruby", "Typescript"],
      "Dev Ops": ["AWS", "Databricks", "Docker", "Kubernetes", "Terraform"],
      "Operating Systems": ["Android", "iOS", "Linux", "Macos", "Windows"]
    },

    "Database": {
      "Relational Database" : ["MySQL", "PostgreSQL", "Microsoft SQL Server", "Oracle Database"],
      "NoSQL Database" : ["MongoDB", "Cassandra", "CouchDB", "Redis"],
      "Graph Database" : ["Neo4j", "Amazon Neptune"],
      "Time Series Database" : ["InfluxDB", "Prometheus"],
      "Document Stores": ["Firestore", "RethinkDB"],
      "NewSQL Database": ["Google Spanner", "CockroachDB"]
    },

      "Media": {
        "Writing": ["30 Day Challenge", "Book Reviews", "Books", "Creative Nonfiction", "Diary", "Fiction", "Nonfiction", "Hello World", "Personal Essay", "Poetry", "Screenwriting", "Short Stories", "This Happened To Me", "Writing Prompts", "Writing Tips"], 
        "Art": ["Comics", "Contemporary Art", "Drawing", "Fine Art", "Generative Art", "Illustration", "Painting", "Portraits", "Street Art"],
        "Gaming": ["Game Design", "Game Development", "India Game", "Metaverse", "Nintendo", "PlayStation", "Videogames", "Virtual Reality", "Xbox"],
        "Humor": ["Comedy", "Jokes", "Parody", "Satire", "Stand Up Comedy"],
        "Movies": ["Cinema", "Film", "Filmmaking", "Movie Reviews", "Oscars", "Sundance"],
        "Music": ["Hip Hop", "Indie", "Metal", "Pop", "Rap", "Rock" ],      
        "News": ["Data Journalism", "Fake News", "Journalism", "Misinformation", "True Crime"],
        "Photography": ["Cameras", "Photography Tips", "Photojournalism", "Photos", "Street Photography"],
        "Podcasts": ["Podcast Equipment", "Podcast Recommendations", "Podcasting", "Podcasting Tips", "Radio"],
        "Television": ["Hbo Max", "Hulu", "Netflix", "Reality TV", "TV Reviews", "Amazon Prime", "Disney + Hotstar", "Zee5", "Sony LIV", "VOOT"]
      },

    "Society" : {
      "Economics": ["Basic Income", "Debt", "Economy", "Inflation", "Stock Market"],
      "Education": ["Charter Schools", "Education Reform", "Higher Education", "PhD", "Public Schools", "Student Loans", "Study Abroad", "Teaching" ],
      "Equality": ["Disability", "Discrimination", "Diversity In Tech", "Feminism", "Inclusion", "LGBTQ", "Racism", "Transgender", "Womens Rights", ],
      "Finance": ["401k", "Investing", "Money", "Philanthropy", "Real Estate", "Retirement"],
      "Law": ["Criminal Justice", "Law School", "Legaltech", "Social Justice", "Supreme Court"],
      "Transportation" : ["Logistics", "Public Transit", "Self Driving Cars", "Trucking", "Urban Planning", "White Privilege", ""],
      "Politics" : ["Elections", "Government", "Gun Control", "Immigration", "Political Parties"],
      "Race" : ["American Indian", "Anti Racism", "Asian American", "Black Lives Matter", "Indigenous People", "Multiracial", "Pacific Islander", "White Supremacy"],
      "Science" : ["Archaeology", "Astronomy", "Astrophysics", "Biotechnology", "Chemistry", "Ecology", "Genetics", "Geology", "Medicine", "Neuroscience", "Physics", "Psychology", "Space"],  
      "Mathematics" : ["Algebra", "Calculus", "Geometry", "Probability", "Statistics"],
      "Drugs" : ["Addiction", "Cannabis", "Opioids", "Pharmaceuticals", "Psychedelics"]
    },

    "Culture" : {
      "Philosophy" : ["Atheism", "Epistemology", "Ethics", "Existentialism", "Metaphysics", "Morality", "Philosophy Of Mind", "Stoicism"], 
      "Religion" : ["Buddhism", "Christianity", "Hinduism", "Islam", "Judaism", "Zen"],     
      "Spirituality" : ["Astrology", "Energy Healing", "Horoscopes", "Mysticism", "Reiki"],
      "Cultural Studies" : ["Ancient History", "Anthropology", "Cultural Heritage", "Digital Life", "History", "Museums", "Sociology", "Tradition"],
      "Fashion" : ["Clothing", "Fashion Design", "Fashion Trends", "Shoes", "Sneakers", "Style"],
      "Beauty" : ["Beauty Tips", "Body Image", "Hair", "Makeup", "Skincare"],
      "Language" : ["Hindi", "Arabic", "English Language", "English Learning", "French", "German", "Language Learning","Linguistics","Mandarin", "Spanish"],
      "Sports" : ["Baseball", "Basketball", "Football", "NBA", "NFL", "Premier League", "Soccer", "World Cup"]
    },

    "World": {
      "Cities" : ["Abu Dhabi", "Amsterdam", "Athens", "Bangkok", "Barcelona", "Berlin", "Boston", "Buenos Aires", "Chicago", "Copenhagen", "Delhi", "Dubai", "Edinburgh", "Glasgow", "Hong Kong", "London", "Los Angeles", "Madrid", "Melbourne", "Mexico City", "Miami", "Montreal", "New York City", "Paris", "Prague", "Rio De Janeiro", "Rome", "San Francisco", "Sydney", "Taipei", "Tel Aviv", "Tokyo", "Toronto", "Vancouver", "Vienna"],                
      "Nature" : ["Birding", "Camping", "Climate Change", "Conservation", "Hiking", "Sustainability", "Wildlife"],    
      "Travel" : ["Travel Tips", "Tourism", "Travel Writing", "Vacation", "Vanlife"]  
    }
  }

  const [topicsArr, setTopicsArr] = useState();
  const [subTopicsArr, setSubTopicsArr] = useState();

  useEffect(() => {
    // Runs only on the first render
    if (selectedTopicsCategory) onTopicsCategoryChange(selectedTopicsCategory);
    if (selectedTopics) onTopicsChange(selectedTopics);
  }, []);

  const onTopicsCategoryChange = (topicCateg) => {
    if (topicCateg && topicCateg[0] && topicsSubTopics[topicCateg[0]]) {
      const topics = Object.keys(topicsSubTopics[topicCateg[0]]);
      setTopicsArr(topics)
    } else {
      setTopicsArr(null)
      setSubTopicsArr(null)

      setSelectedTopics(null)
      setSelectedSubTopics(null)
    }
  }

  const onTopicsChange = (topic) => {
    if (topic && topic[0]) {
      const topicsObject = topicsSubTopics[selectedTopicsCategory[0]];
      const subTopics = topicsObject[topic[0]];
      setSubTopicsArr(subTopics)
    } else {
      setSubTopicsArr(null)
      setSelectedSubTopics(null)
    }
  }

  return (
    <>
      <Box className='ce-block__content' sx={{ mx: 'auto', mt: '20px' }}>
          {topicsCategory && 
              <LimitedMultiSelect
                size="small"
                options={topicsCategory}
                selectedOptions={selectedTopicsCategory}
                setSelectedOptions={setSelectedTopicsCategory}
                maxSelections={1}
                label="Select Topics Category"
                // loading={loading}
                errorText={topicsCategoryErr}
                setErrorText={setTopicsCategoryErr}
                onChange={onTopicsCategoryChange}
              />
          }
      </Box>
      <Box className='ce-block__content' sx={{ mx: 'auto', mt: '20px' }}>
          {topicsArr && 
              <LimitedMultiSelect
                size="small"
                options={topicsArr}
                selectedOptions={selectedTopics}
                setSelectedOptions={setSelectedTopics}
                maxSelections={1}
                label="Select Topics"
                // loading={loading}
                errorText={topicsErr}
                setErrorText={setTopicsErr}
                onChange={onTopicsChange}
              />
          }
      </Box>
      <Box className='ce-block__content' sx={{ mx: 'auto', mt: '20px' }}>
        {subTopicsArr && 
            <LimitedMultiSelect
              size="small"
              options={subTopicsArr}
              selectedOptions={selectedSubTopics}
              setSelectedOptions={setSelectedSubTopics}
              maxSelections={3}
              label="Select Sub Topics"
              // loading={loading}
              errorText={subTopicsErr}
              setErrorText={setSubTopicsErr}
            />
        }
      </Box>
    </>
  )
}
