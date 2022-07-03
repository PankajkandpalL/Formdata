import { useState } from "react"
import axios from 'axios'
import { useEffect } from "react"
import './form.module.css'

let initFormData = {

}

function Form(){

    let [formdata,setformdata] = useState(initFormData)
    let [change,setChange] = useState(false)
    let [userdata,setUserData]  = useState([])
    let [page,setpage] = useState(1)
    let [filteredvalue,setfilteredvalue] = useState("Default")
    let [sortby,setSortBy] = useState("None")

    useEffect(()=>{
        getData(page,filteredvalue,sortby)
    },[change,page,filteredvalue,sortby])

    let getData = (p,fvalue,sortby) => {

        if(fvalue==="Default" && sortby==="None" )
        {
            axios.get(`http://localhost:8080/posts?&_page=${p}&_limit=5`).then((res)=>{
            setUserData(res.data);
        })
        .catch((err)=>{
            console.log(err)
        })
        }
        else if(fvalue==="Default" && sortby==="lth" )
        {
            axios.get(`http://localhost:8080/posts?_sort=salary&_order=asc&_page=${p}&_limit=5`).then((res)=>{
                setUserData(res.data);
            })
            .catch((err)=>{
                console.log(err)
            }) 
        }
        else if(fvalue==="Default" && sortby==="htl" )
        {
            axios.get(`http://localhost:8080/posts?_sort=salary&_order=desc&_page=${p}&_limit=5`).then((res)=>{
                setUserData(res.data);
            })
            .catch((err)=>{
                console.log(err)
            }) 
        }
        else if(sortby==="htl" ){
        axios.get(`http://localhost:8080/posts?Department=${fvalue}&_sort=salary&_order=desc&_page=${p}&_limit=5`).then((res)=>{
            setUserData(res.data);
        })
        .catch((err)=>{
            console.log(err)
        })
        }
        else if(sortby==="lth")
        {
            axios.get(`http://localhost:8080/posts?Department=${fvalue}&_sort=salary&_order=asc&_page=${p}&_limit=5`).then((res)=>{
                setUserData(res.data);
            })
            .catch((err)=>{
                console.log(err)
            })  
        }
        else if(sortby==="None" && fvalue!=="Default" ){
            axios.get(`http://localhost:8080/posts?Department=${fvalue}&_page=${p}&_limit=5`).then((res)=>{
                setUserData(res.data);
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    let handleChange = (e) =>{

        let {value,name,type,checked} = e.target;

        let valueToUpdate = type==="checkbox" ? checked : value;

        setformdata({
            ...formdata,
            [name] : valueToUpdate
        })
    }

    let handleSubmit = (e) =>{
        e.preventDefault()
        axios.post('http://localhost:8080/posts', formdata)
        setChange(!change)

    }

    let handleDelete = (id) =>{

        axios.delete(`http://localhost:8080/posts/${id}`).then((res)=>{
        // ---
        })
        .catch((err)=>{
            console.log(err)
        })
        setChange(!change)
    }

    let handleFilter = (e)=>{
        setfilteredvalue(e.target.value)
    }

    let handlesort = (e) =>{
        setSortBy(e.target.value)
    }



    return (
        <>
            <form onSubmit={handleSubmit} > 
                <input onChange={handleChange} type="text" value={formdata.name} name="name" placeholder="Name" />
                <br />
                <input onChange={handleChange} type="email" value={formdata.email} name="email" placeholder="Email" />
                <br />
                <input onChange={handleChange} type="number" value={formdata.age} name="age" placeholder="age" />
                <br />
                <select onChange={handleChange} defaultValue={formdata.Department} name="Department">
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operation">Operation</option>
                    <option value="Finance">Finance</option>
                </select>
                <br />
                <input onChange={handleChange} type="number" name="salary" value={formdata.salary} placeholder="Salary" />
                <br />
                <input onChange={handleChange} type="checkbox" name="status" checked={formdata.status} /><span>Martial Status</span>
                <br />
                <input onChange={handleChange} type="submit" />
            </form>
            <div>
            <select defaultValue="Default" onChange={handleFilter} >
                    <option value="Default">All</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operation">Operation</option>
                    <option value="Finance">Finance</option>
            </select>
            <select onChange={handlesort} >
                <option value="None">Default</option>
                <option value="htl">High To Low</option>
                <option value="lth">Low To High</option>
            </select>
            </div>
            <button disabled={page===1} onClick={()=>setpage(page-1)} >Prev</button>
            <button onClick={()=>setpage(page+1)} >Next</button>
            <div>
                <table>
                    <thead >
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Department</th>
                            <th>Martial Status</th>
                            <th>Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userdata.map((el)=>(
                                <tr>
                                    <td>{el.name}</td>
                                    <td>{el.age}</td>
                                    <td>{el.Department}</td>
                                    <td>{el.status?"Married":"UnMarried"}</td>
                                    <td>{el.salary}</td>
                                    <button onClick={()=>handleDelete(el.id)} >Delete</button>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export {Form}