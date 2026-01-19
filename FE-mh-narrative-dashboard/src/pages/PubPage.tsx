import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FileSignature,
  Github,
  ChevronDown,
  Microscope,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import teaser from "@/assets/teaser.webp";
import React from "react";
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner";

const abbrevTitle = "MIND";
const subTitle =
  "Empowering Mental Health Clinicians with Multimodal Data Insights through a Narrative Dashboard";

const authors = [
  {
    name: "Ruishi Zou",
    affiliation: "Columbia University",
    webpage: "https://ruishizou.github.io/",
    coFirst: true,
  },
  {
    name: "Shiyu Xu",
    affiliation: "Columbia University",
    webpage: "https://raynexu.com/",
    coFirst: true,
  },
  {
    name: "Margaret Morris",
    affiliation: "University of Washington",
    webpage: "https://www.margaretmorrisphd.com/",
    coFirst: false,
  },
  {
    name: "Jihan Ryu",
    affiliation: "Hamilton-Madison House",
    webpage: "",
    coFirst: false,
  },
  {
    name: "Timothy Becker",
    affiliation: "Weill Cornell Medicine",
    webpage: "",
    coFirst: false,
  },
  {
    name: "Nicholas Allen",
    affiliation: "University of Oregon",
    webpage: "",
    coFirst: false,
  },
  {
    name: "Anne Marie Albano",
    affiliation: "Columbia University",
    webpage: "",
    coFirst: false,
  },
  {
    name: "Randy Auerbach",
    affiliation: "Columbia University",
    webpage: "",
    coFirst: false,
  },
  {
    name: "Dan Adler",
    affiliation: "Cornell University",
    webpage: "https://dadler.co/",
    coFirst: false,
  },
  {
    name: "Varun Mishra",
    affiliation: "Northeastern University",
    webpage: "https://varunmishra.com/",
    coFirst: false,
  },
  {
    name: "Lace Padilla",
    affiliation: "Northeastern University",
    webpage: "https://www.lacepadilla.com/",
    coFirst: false,
  },
  {
    name: "Dakuo Wang",
    affiliation: "Northeastern University",
    webpage: "https://www.dakuowang.com/",
    coFirst: false,
  },
  {
    name: "Ryan Sultan",
    affiliation: "Columbia University",
    webpage: "",
    coFirst: false,
  },
  {
    name: 'Xuhai "Orson" Xu',
    affiliation: "Columbia University",
    webpage: "https://orsonxu.com/",
    coFirst: false,
  },
];

const bibliography = `@inproceedings{zou2026mind,
  author    = {Ruishi Zou and Shiyu Xu and Margaret Morris and Jihan Ryu and Timothy Becker and Nicholas Allen and Anne Marie Albano and Randy Auerbach and Dan Adler and Varun Mishra and Lace Padilla and Dakuo Wang and Ryan Sultan and Xuhai "Orson" Xu},
  title     = {MIND: Empowering Mental Health Clinicians with Multimodal Data Insights through a Narrative Dashboard},
  booktitle = {Proceedings of CHI 2026},
  year      = {2026},
}`;

export default function PubPage() {
  // Handler to open dropdown in a new tab (for Explore)
  const handleExplore = (route: string) => {
    window.open(
      window.location.origin + "#" + route,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopyBib = () => {
    navigator.clipboard.writeText(bibliography);
    toast.success("Copied!", {
      // description: "BibTeX citation copied to clipboard.",
      // action: {
      //   label: "Undo",
      //   onClick: () => {}, // No undo logic needed, but matches reference usage
      // },
      duration: 1500,
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-8 space-y-8 overflow-y-auto">
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] flex flex-col items-center shadow-none bg-transparent border-none">
        {/* Title and Authors */}
        <h1 className="text-6xl font-extrabold mb-2 text-center drop-shadow-lg">
          {abbrevTitle}
        </h1>
        <h2 className="text-2xl font-medium mb-2 text-center italic">
          {subTitle}
        </h2>
        <div className="text-base text-muted-foreground mb-1 text-center font-normal flex flex-wrap justify-center gap-x-1">
          {authors.map((author, idx) => (
            <div
              key={author.name}
              className="flex items-center whitespace-nowrap"
            >
              {author.webpage ? (
                <a
                  href={author.webpage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 underline font-normal"
                >
                  {author.name}
                </a>
              ) : (
                <span className="text-gray-600 font-normal">{author.name}</span>
              )}
              {author.coFirst ? <sup>*</sup> : null}
              {idx < authors.length - 1 && <span>,</span>}
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground mb-2 text-center">
          <sup>*</sup>Equal contribution
        </div>
        <div className="flex flex-row flex-wrap gap-4 mb-4 w-full justify-center sm:justify-center max-w-xl mx-auto">
          <Button asChild variant="outline" className="">
            <a
              href="https://arxiv.org/abs/xxxx.xxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 justify-center"
            >
              <FileText className="w-4 h-4" />
              Paper
            </a>
          </Button>
          <Button asChild variant="outline" className="">
            <a
              href="https://arxiv.org/abs/xxxx.xxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 justify-center"
            >
              <FileSignature className="w-4 h-4" />
              Preprint
            </a>
          </Button>
          <Button asChild variant="outline" className="">
            <a
              href="https://github.com/sea-lab-space/MIND"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 justify-center"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          </Button>
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 justify-center"
                >
                  <Microscope className="w-4 h-4" />
                  Prototypes
                  <ChevronDown className="ml-1 w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleExplore("/mind")}
                  className="cursor-pointer"
                >
                  MIND
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExplore("/fact")}
                  className="cursor-pointer"
                >
                  FACT
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Introduction Section */}
        <section className="w-full mb-6">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-xl mb-4 rounded-lg overflow-hidden flex justify-center">
              <img
                src={teaser}
                alt="Teaser for MIND project"
                className="w-full h-auto"
              />
            </div>
          </div>
          <p className="text leading-[1.5] text-justify break-words">
            MIND (<u>M</u>ultimodal <u>I</u>ntegrated <u>N</u>arrative <u>D</u>
            ashboard) is a proof-of-concept research prototype that explores how
            multimodal patient data can be best represented to mental health
            clinicians for clinical decision-making. Instead of designing a
            "data collection" dashboard (i.e., showing multimodal data in
            separate tabs), MIND is <i>narrative</i>--multimodal data are
            curated through an automatic pipeline into a coherent "story". We
            designed the narrative (and the computation pipeline behind it)
            motivated by co-design sessions with 5 mental health clinicians, and
            conducted a mixed-method evaluation study with 16 clinicians to
            understand the benefits and limitations of the narrative dashboard
            design. We found that clinicians perceive MIND as a significant
            improvement over baseline methods, reporting improved performance to
            reveal hidden and clinically relevant data insights and support
            their decision-making.
          </p>
        </section>

        {/* Video Section */}
        <section className="w-full mb-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Video Teaser</h2>
          <Separator className="mb-4" />
          <div className="w-full aspect-video max-w-xl mb-4 rounded-lg overflow-hidden bg-black mx-auto">
            {/* Replace the src with your actual video link */}
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/yP3xUMRLJ1g"
              title="MIND Video Teaser"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {/* Reserved space for talk video link */}
          <div className="w-full flex justify-center mb-2">
            <a
              href="#"
              className="text-primary underline text-sm opacity-50 pointer-events-none"
              tabIndex={-1}
            >
              [Talk video link coming soon]
            </a>
          </div>
        </section>

        {/* Pipeline Section */}
        {/* <section className="w-full mb-6">
          <h2 className="text-2xl font-semibold mb-2">Computation Pipeline</h2>
          <Separator className="mb-4" />
          <p className="leading-relaxed text-justify break-words">
            MIND's computation pipeline consists of several modules: data ingestion, preprocessing, feature extraction, narrative generation, and visualization. Each module is designed to be extensible and interpretable, allowing for integration of new data types and analytic methods.
          </p>
          <p className="mt-4 leading-relaxed text-justify break-words">
            The pipeline ensures that raw clinical and behavioral data are transformed into actionable insights, presented in a narrative format that is accessible and clinically relevant.
          </p>
          <div className="w-full flex justify-center mb-6 mt-6">
            <div className="w-full max-w-2xl bg-gray-100 rounded-lg flex items-center justify-center h-64">
              <span className="text-gray-400">[Pipeline diagram coming soon]</span>
            </div>
          </div>
        </section> */}

        {/* Bibliography Section */}
        <section className="w-full">
          <h2 className="text-2xl font-semibold mb-2">BibTeX</h2>
          <Separator className="mb-4" />
          <div className="relative">
            <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm font-mono relative whitespace-pre-line leading-relaxed break-words">
              <code style={{ wordBreak: "break-all", whiteSpace: "pre-line" }}>
                {bibliography}
              </code>
              <Toaster />
              <Button
                size="sm"
                variant="default"
                onClick={handleCopyBib}
                className="absolute top-2 right-2 px-2 py-1 text-xs flex items-center gap-1"
                aria-label="Copy citation"
              >
                <Copy className="w-3 h-3" />
                Copy
              </Button>
            </pre>
          </div>
        </section>

        <footer className="w-full mt-5 flex justify-start items-center py-6">
          <a
            href="https://sea-lab.space/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground text-sm hover:underline"
          >
            © SEA Lab 2026
          </a>
        </footer>
      </div>
    </div>
  );
}
