"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Profile() {
  const { data: session, status } = useSession(); // Use status to determine loading state
  const router = useRouter();
  const [mbtiResult, setMbtiResult] = useState("");
  const [successStory, setSuccessStory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAlumni, setIsAlumni] = useState(false); // Check if user is an alumni

  useEffect(() => {
    // Redirect to login if the user is unauthenticated
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      // Fetch the saved MBTI result (mocked here, replace with API call)
      const fetchMbtiResult = async () => {
        try {
          const res = await fetch("/api/profile/mbti");
          const data = await res.json();
          setMbtiResult(data.mbti || "No result yet");
        } catch (error) {
          console.error("Error fetching MBTI result:", error);
        }
      };

      fetchMbtiResult();
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.role === "alumni") {
      setIsAlumni(true); // Mark user as alumni
      // Fetch current success story from the API (if any)
      const fetchSuccessStory = async () => {
        const res = await fetch("/api/alumni/success-story");
        const data = await res.json();
        setSuccessStory(data.successStory || "");
      };

      fetchSuccessStory();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/alumni/success-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ successStory }),
    });

    if (res.ok) {
      alert("Success story updated!");
      setIsEditing(false); // Stop editing mode after success
    } else {
      alert("Error updating success story.");
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Only render the profile when authenticated
  return (
    <div>
      <h1>Profile</h1>
      {session && (
        <>
          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>

          <h3>Your MBTI Type: {mbtiResult}</h3>

          <button
            onClick={() => router.push("/mbti-test")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "20px",
            }}
          >
            Take MBTI Test
          </button>

          {isAlumni && (
            <div>
              <h3>Success Story</h3>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <textarea
                    value={successStory}
                    onChange={(e) => setSuccessStory(e.target.value)}
                    placeholder="Share your success story..."
                    required
                    style={{ width: "100%", height: "100px" }}
                  />
                  <br />
                  <button type="submit">Update Success Story</button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)} // Cancel editing
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div>
                  <p>{successStory || "No success story added yet."}</p>
                  <button onClick={() => setIsEditing(true)}>
                    Edit Success Story
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
