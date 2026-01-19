# MIND: Multimodal Integrated Narrative Dashboard

[![BSD-3-Clause License](https://img.shields.io/github/license/sea-lab-space/MIND)](/LICENSE) [![arXiv](https://img.shields.io/badge/arXiv-[number]-b31b1b.svg)](https://arxiv.org/abs/[number])

![Teaser](FE-mh-narrative-dashboard/src/assets/teaser.webp)

MIND (<u>M</u>ultimodal <u>I</u>ntegrated <u>N</u>arrative <u>D</u>ashboard) is a proof-of-concept research prototype that explores how multimodal patient data can be best represented to mental health clinicians for clinical decision-making. Instead of designing a "data collection" dashboard (i.e., showing multimodal data in separate tabs), MIND is narrative--multimodal data are curated through an automatic pipeline into a coherent "story". We designed the narrative (and the computation pipeline behind it) motivated by co-design sessions with 5 mental health clinicians, and conducted a mixed-method evaluation study with 16 clinicians to understand the benefits and limitations of the narrative dashboard design. We found that clinicians perceive MIND as a significant improvement over baseline methods, reporting improved performance to reveal hidden and clinically relevant data insights and support their decision-making.

## Using MIND

You don't need to install anything to try out our prototype -- simply find the prototype in our [project homepage](https://sea-lab.space/MIND)!

In case you want to try it locally, MIND is structured with a frontend and backend:
* `FE-mh-narrative-dashboard` hosts the frontend code -- to try out the interaction flow of MIND locally, you only need to follow the installation guide within the folder. For simplicity, we built the interative prototype as a static webpage.
* `BE-mh-narrative-dashboard` hosts the backend code -- you will only need this if you want to further understand how we transformed raw data into narrative insights. Please refer to the backend folder for the installation guide.



## Citing MIND

If you find MIND a fun/useful project, please cite our paper (and give us a star): 

```bib
@inproceedings{zou2026mind,
}
```
