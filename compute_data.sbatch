#!/bin/tcsh
#SBATCH --job-name=pickle_betti
#SBATCH --array=0-11
#SBATCH -n 12
#SBATCH --time=225:00:00
#SBATCH --mail-type=FAIL
#SBATCH --mail-type=END
#SBATCH --mail-user=price29@illinois.edu

sage compute_data.py