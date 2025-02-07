import React from "react";
import { useParams } from "react-router-dom";

const BlogPost = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const posts = [
    {
      id: "1",
      title: "The Importance of Gut Health for Overall Well-Being",
      date: "February 3, 2025",
      content: `Gut health plays a significant role in our overall health. The gut is home to trillions of bacteria, fungi, and other microorganisms that contribute to digestive health and immune function. A healthy gut can prevent conditions such as irritable bowel syndrome, chronic bloating, and food sensitivities. Studies also show that gut health is linked to mental health, weight regulation, and skin health. By maintaining a balanced gut microbiome, you can support your body’s natural ability to heal and function at its best. Eating a balanced diet rich in fiber, probiotics, and prebiotics, as well as reducing processed food intake, are great ways to start improving your gut health.`,
    },
    {
      id: "2",
      title: "How to Support Your Gut Health with Probiotics",
      date: "January 25, 2025",
      content: `Probiotics are beneficial bacteria that help maintain the balance of good and bad bacteria in the gut. By adding probiotics to your diet, you can support digestive health and enhance your immune system. Foods such as yogurt, kefir, sauerkraut, and kimchi are natural sources of probiotics. Supplements are also available, but it's important to choose high-quality products with the right strains of bacteria for your health needs. Regular consumption of probiotics can help prevent digestive disorders, ease bloating, and improve overall gut function.`,
    },
    {
      id: "3",
      title: "The Role of Fiber in Maintaining Gut Health",
      date: "December 15, 2024",
      content: `Fiber plays a vital role in digestive health. It helps regulate bowel movements, prevent constipation, and maintain a healthy weight. There are two types of fiber: soluble and insoluble. Soluble fiber absorbs water and forms a gel-like substance, which helps lower cholesterol levels and regulate blood sugar. Insoluble fiber adds bulk to stool and aids in moving food through the digestive tract. Foods such as fruits, vegetables, whole grains, and legumes are excellent sources of fiber. Incorporating fiber into your diet can improve gut health, promote regularity, and lower the risk of chronic diseases.`,
    },
    {
      id: "4",
      title: "Why Gut Health Affects Your Immune System",
      date: "November 10, 2024",
      content: `The gut is home to more than 70% of the body’s immune system. A healthy gut microbiome is crucial for maintaining immune function and preventing illness. When the balance of bacteria in the gut is disturbed, it can lead to immune dysfunction, making the body more susceptible to infections and autoimmune diseases. By supporting gut health with a diet rich in probiotics, prebiotics, and fiber, you can strengthen your immune system and protect your body from harmful pathogens. Lifestyle factors such as stress, lack of sleep, and poor diet can also negatively impact the gut, so it’s essential to prioritize gut health for optimal immune function.`,
    },
  ];

  const post = posts.find((p) => p.id === id); // Find the post by ID

  if (!post) {
    return <p>Post not found!</p>; // In case the post doesn't exist
  }

  return (
    <div className="max-w-3xl mx-auto my-8">
      <h2 className="text-3xl font-semibold text-gray-800">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-4">{post.date}</p>
      <p className="text-lg text-gray-700">{post.content}</p>
    </div>
  );
};

export default BlogPost;
