"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mbtiResult, setMbtiResult] = useState("");
  const [successStory, setSuccessStory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAlumni, setIsAlumni] = useState(false); 
  const [isStudent, setIsStudent] = useState(false); // Check if user is a student
  const [mentor, setMentor] = useState(null); // Mentor state for students
  const [supervisor, setSupervisor] = useState(null); // Supervisor state for students

  // Fetch MBTI result and check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
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

  // Fetch alumni success story if the user is an alumni
  useEffect(() => {
    if (session?.user?.role === "alumni") {
      setIsAlumni(true);
      const fetchSuccessStory = async () => {
        const res = await fetch("/api/alumni/success-story");
        const data = await res.json();
        setSuccessStory(data.successStory || "");
      };

      fetchSuccessStory();
    }
  }, [session]);

  // Fetch mentor and supervisor information if the user is a student
  useEffect(() => {
    if (session?.user?.role === "student") {
      setIsStudent(true);

      // Fetch mentor (alumni) information
      const fetchMentor = async () => {
        try {
          const res = await fetch(`/api/students/mentor`);
          const data = await res.json();
          setMentor(data.mentor || null);
        } catch (error) {
          console.error("Error fetching mentor:", error);
        }
      };

      // Fetch supervisor (faculty) information
      const fetchSupervisor = async () => {
        try {
          const res = await fetch(`/api/supervisor/${session?.user?.id}`);
          const data = await res.json();
          setSupervisor(data.supervisor || null);
        } catch (error) {
          console.error("Error fetching supervisor:", error);
        }
      };

      fetchMentor();
      fetchSupervisor();
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
      setIsEditing(false);
    } else {
      alert("Error updating success story.");
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

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

          {/* Alumni-specific section */}
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
                    onClick={() => setIsEditing(false)}
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

          {/* Student-specific section */}
          {isStudent && (
            <div>
              {/* Mentor Information */}
              <h3>Mentor Information</h3>
              {mentor ? (
                <div>
                  <p><strong>Name:</strong> {mentor.name}</p>
                  <p><strong>Email:</strong> {mentor.email}</p>
                  <p><strong>Approved At:</strong> {new Date(mentor.approvedAt).toLocaleString()}</p>
                </div>
              ) : (
                <p>No mentor selected yet.</p>
              )}

              {/* Supervisor Information */}
              <h3>Supervisor Information</h3>
              {supervisor ? (
                <div>
                  <p><strong>Faculty Name:</strong> {supervisor.facultyName}</p>
                  <p><strong>Faculty Email:</strong> {supervisor.facultyEmail}</p>
                  <p><strong>Assigned At:</strong> {new Date(supervisor.assignedAt).toLocaleString()}</p>
                </div>
              ) : (
                <p>No supervisor assigned yet.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
