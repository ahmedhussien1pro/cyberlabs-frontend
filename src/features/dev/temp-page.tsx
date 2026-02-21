import Navbar from "@/shared/components/layout/navbar"
import { HeroSection } from "../landing/components"
import { CourseCurriculumAccordion } from "@/features/courses/components/CourseCurriculumAccordion"
import contentData from "./../courses/data"

export default function TempPage() {

    return (
        <>
            <Navbar />
            <HeroSection />
            <div className="w-2/3 m-auto mt-2">
                <CourseCurriculumAccordion
                    topics={contentData.topics}
                    lang="en"
                    imageMap={{}}
                />
            </div>

        </>
    )
}
