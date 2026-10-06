#!/usr/bin/env sage
from sage.all import * # type: ignore
from grobnercrystals import *
import pickle
import os

if __name__ == '__main__':
    n = 5
    Sn = list(Permutations(n))
    batch_num = int(os.getenv("SLURM_ARRAY_TASK_ID"))
    Sn_chunks = list(it.batched(Sn,10))
    chunk = Sn_chunks[batch_num]
    chunk = [list(elt) for elt in chunk if not list(elt)==[i+1 for i in range(n)]]

    for w in chunk:
        wstr = ''
        for i in range(n):
            wstr += str(w[i])

        raw_file_name = 'raw-msv-betti-data/'+wstr+'.pickle'
        html_file_name = 'msv-betti-data/'+wstr+'.html'

        exceptions = []

        try:
            X = eff_msv(w)
            (I,J) = Perm(w).levi_datum()
            betti = X.equivariant_betti(I=I,J=J)
            betti_html = X.equivariant_betti_html(betti=betti)

            with open(raw_file_name,'wb') as f:
                pickle.dump(betti,f)
            
            with open(html_file_name,'w') as f:
                f.write(betti_html)

        except:
            exceptions.append(w)

    if exceptions != []:  
        with open('exceptions/'+str(n)+'-'+str(batch_num)+'.pickle','wb') as f:
            pickle.dump(exceptions,f)