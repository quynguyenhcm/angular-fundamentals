import { Component, OnInit } from '@angular/core';
import { GitSearchService } from '../git-search.service';
import { GitSearch} from '../git-search';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AdvancedSearchModel } from '../advanced-search-model';

@Component({
  selector: 'app-git-search',
  templateUrl: './git-search.component.html',
  styleUrls: ['./git-search.component.css']
})
export class GitSearchComponent implements OnInit {
  searchResults: GitSearch;
  searchQuery: string;
  title: string;
  displayQuery: string;
  // tslint:disable-next-line:no-shadowed-variable
  constructor(
    // tslint:disable-next-line:no-shadowed-variable
    private GitSearchService: GitSearchService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  model = new AdvancedSearchModel('', '', '', null, null, '');
  modelKeys = Object.keys(this.model);

  ngOnInit() {
    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.searchQuery = params.get('query');
      this.displayQuery = params.get('query');
      this.gitSearch();
    });
    this.route.data.subscribe( (result) => {
      this.title = result.title;
    });
    this.GitSearchService.gitSearch('angular').then((response: GitSearch) => {
      console.log(response);
      this.searchResults = response;
    }, (error) => {
      alert('Error: ' + error.statusText);
    });
  }

  gitSearch = () => {
    this.GitSearchService.gitSearch(this.searchQuery).then((response: GitSearch) => {
      this.searchResults = response;
    }, (error) => {
      alert('Error: ' + error.statusText);
    });
  }

  sendQuery = () => {
    this.searchResults = null;
    let search: string = this.model.q;
    let params: string = '';
    // Search URL looksl ike: https://api.github.com/search/repositories?q=tetris+language:assembly
    this.modelKeys.forEach((elem) => {
        if (elem === 'q') {
          return false;
        }
        if (this.model[elem]) {
          params += '+' + elem + ':' + this.model[elem];
        }
    });
    this.searchQuery = search;
    if (params !== '') {
      this.searchQuery = search + '+' + params;
    }
    this.displayQuery = this.searchQuery;
    this.gitSearch();
    //this.router.navigate(['/search/' + this.searchQuery]);
  }
}
