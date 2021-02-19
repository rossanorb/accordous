// import { useEffect, useState } from "react";
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Link } from "react-router-dom";
import Table from '../components/Table';
import api from '../api/apiImovel';
import Dialog from '../components/Dialog';
import Toastr from '../components/Toastr';

export default class Imoveis extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: 0,
            data: '',
            errors: '',
            queryString: {
                page: 1,
                limit: 10
            },
            paginate: {
                current_page: 0,
                last_page: 0
            },
            table: {
                actions: ['delete'],
                columns: [
                    {
                        name: 'E-mail',
                        mapping: 'email',
                        sort: true
                    },
                    {
                        name: 'Endereço',
                        mapping: 'rua',
                        sort: true
                    },
                    {
                        name: 'Status',
                        mapping: 'contrato',
                        sort: true
                    }
                ]
            }
        }        
    }
    
    componentDidMount() {
        this.list()
    }

    confirmDelete = (id) => {        
        this.setState({id: id})
        this.dialog.show()
    }

    setPage = async (page) => {
        this.state.queryString.page = page;
    }

    changePage = (page) => {
        this.setPage(page);
        this.list();
    }

    showMessage = async (msg, bg) => {
        await this.toastr.show(msg, bg);
    }

    remove = async () => {
        try {
            const request = await api.delete(this.state.id);
            if(request.status) {
                this.showMessage('Imóvel removido com sucesso!', 'success');
            } else {
                this.showMessage('Ocorreu um erro!', 'danger');	
            }

        } catch (error) {
            this.showMessage('Ocorreu um erro!', 'danger');
        }
    }

    list = async () => {
        const { page, limit } = this.state.queryString;
        const request = await api.List(`page=${page}&limit=${limit}`);
        this.setState({
            items: request.result,
            paginate:{
                current_page: request.paginate.current_page,
                last_page: request.paginate.last_page
            }
        })
    }

    callback = () => {
        new Promise(function(resolve){resolve()})
        .then( this.setPage(1))
        .then( this.list() )
    }     

    render() {
        const { items, table, paginate } = this.state;

        return (
            <div className="container">
                <Dialog                    
                    callback={this.remove}
                    onRef={ref => (this.dialog = ref)}
                 />
                 <Toastr
                    callback={this.callback}
                    onRef={ref => (this.toastr = ref)}
                 />
                <div className="py-5 text-center">
                    <h2>Imóveis</h2>
                </div>
                <div className="row">
                    <Router>
                    <div className="col-sm-12">
                        <Link className="btn btn-success mb-3" to="/imoveis/cadastro">Cadastrar</Link>
                    </div>
                    </Router>
                    <div className="col-sm-12">
                        <div className="table-responsive">
                        { items && <Table 
                                    table={table}
                                    items={items}                                    
                                    confirmDelete={ this.confirmDelete }
                                    changePage={ this.changePage }
                                    paginate={ paginate }
                                />
                        }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
