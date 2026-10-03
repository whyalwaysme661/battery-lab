# Website fonts

The interface uses self-hosted subsets of IBM Plex Sans and Noto Sans SC, licensed under SIL OFL 1.1. License texts and original copyright notices are included in this directory.

Sources:
- https://github.com/google/fonts/tree/main/ofl/ibmplexsans
- https://github.com/google/fonts/tree/main/ofl/notosanssc

Subsets retain the weight axis and cover the interface, catalog and common scientific characters. The IBM width axis is retained and the interface uses its standard width. Internal family names are changed to Lab Latin and Lab Sans to respect the reserved font name. System fallback handles additional scientific symbols and user-entered characters outside the shipped subset.