import { useState } from "react";
import "./update.scss";
import makeRequest from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    name: "",
    city: "",
    website: "",
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (updatedUser) => {
      return makeRequest.put("/users", updatedUser);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch user data
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    // Upload cover and profile images if they are selected
    const coverUrl = cover ? await upload(cover) : user.coverPic;
    const profileUrl = profile ? await upload(profile) : user.profilePic;

    // Trigger the mutation to update the user
    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
  };

  return (
    <div className="update">
      <h2>Update Profile</h2>
      <form>
        <label>Cover Image:</label>
        <input type="file" onChange={(e) => setCover(e.target.files[0])} />

        <label>Profile Image:</label>
        <input type="file" onChange={(e) => setProfile(e.target.files[0])} />

        <label>Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={texts.name}
          onChange={handleChange}
        />

        <label>City:</label>
        <input
          type="text"
          name="city"
          placeholder="Enter your city"
          value={texts.city}
          onChange={handleChange}
        />

        <label>Website:</label>
        <input
          type="text"
          name="website"
          placeholder="Enter your website"
          value={texts.website}
          onChange={handleChange}
        />

        <button onClick={handleClick}>Update</button>
      </form>
      <button onClick={() => setOpenUpdate(false)}>Close</button>
    </div>
  );
};

export default Update;
