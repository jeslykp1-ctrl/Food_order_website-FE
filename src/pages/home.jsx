import Container from "@mui/material/Container";
import Hero from "../components/hero";
import PopularLocations from "../components/popular-locations";

export default function Home() {
const loggedInUser = JSON.parse(localStorage.getItem("authUser"));
  console.log(loggedInUser,"===ob")
  return (
    <div className="min-h-screen flex flex-col">
      <main>
        {loggedInUser ? (
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center pt-3">
            Welcome{" "}
            <span className="text-orange-500">
              {loggedInUser?.userObject?.username}
            </span>
          </h1>
        ) : (
          ""
        )}
        <Hero />
        <Container maxWidth="lg">
          <PopularLocations />
        </Container>
      </main>
    </div>
  );
}
