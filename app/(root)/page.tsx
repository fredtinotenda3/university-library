import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import React from "react";

const Home = async () => (
  <>
    <BookOverview />
    <BookList />
  </>
);

export default Home;
